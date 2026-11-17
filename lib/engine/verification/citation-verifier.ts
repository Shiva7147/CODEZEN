import DiffMatchPatch from "diff-match-patch";
import { diffWords, Change } from "diff";
import { Finding, FindingConfidence } from "../types";

export interface StoredClause {
  id: string;
  clauseCode: string;
  sectionHeading?: string;
  clauseText: string;
  category?: string;
}

export interface VerificationCheck {
  clauseExists: boolean;
  quoteMatchesSource: boolean;
  flaggedTextInSubmission: boolean;
  tokenFidelityScore: number; // 0.0 - 1.0
  matchedSourceExcerpt?: string;
  confidence: FindingConfidence;
  rejectionReason?: string;
  diffTokens?: Change[];
}

export class CitationVerifier {
  private dmp: InstanceType<typeof DiffMatchPatch>;

  constructor() {
    this.dmp = new DiffMatchPatch();
    this.dmp.Match_Threshold = 0.35; // 0.0 = exact match; 0.35 = tolerates minor OCR/whitespace variations
    this.dmp.Match_Distance = 4000;
  }

  /**
   * Verifies an individual finding against the source clause library and submission text.
   */
  public verifyFinding(
    finding: {
      clauseId: string;
      exactQuote: string;
      flaggedText: string;
    },
    submissionText: string,
    storedClauses: Map<string, StoredClause>
  ): VerificationCheck {
    // Check 1: Does the clause ID exist in our stored guidelines?
    const storedClause = storedClauses.get(finding.clauseId);
    if (!storedClause) {
      return {
        clauseExists: false,
        quoteMatchesSource: false,
        flaggedTextInSubmission: submissionText.toLowerCase().includes(finding.flaggedText.toLowerCase()),
        tokenFidelityScore: 0,
        confidence: "rejected",
        rejectionReason: `Cited clause ID "${finding.clauseId}" does not exist in the approved guideline library.`
      };
    }

    // Check 2: Does the flagged text exist in the user submission?
    const normSubmission = normalizeWhitespace(submissionText);
    const normFlagged = normalizeWhitespace(finding.flaggedText);
    const flaggedInSubmission = normSubmission.includes(normFlagged);

    if (!flaggedInSubmission) {
      return {
        clauseExists: true,
        quoteMatchesSource: false,
        flaggedTextInSubmission: false,
        tokenFidelityScore: 0,
        confidence: "rejected",
        rejectionReason: `Flagged text "${finding.flaggedText.slice(0, 40)}..." was not found in the submitted content.`
      };
    }

    // Check 3: Does the quoted text appear in that stored clause?
    const normClauseText = normalizeWhitespace(storedClause.clauseText);
    const normQuote = normalizeWhitespace(finding.exactQuote);

    // Fast path: Exact normalized substring match
    if (normClauseText.includes(normQuote)) {
      return {
        clauseExists: true,
        quoteMatchesSource: true,
        flaggedTextInSubmission: true,
        tokenFidelityScore: 1.0,
        matchedSourceExcerpt: normQuote,
        confidence: "confirmed"
      };
    }

    // Google's diff-match-patch Bitap algorithm has a 32-character bitmask limit in JS.
    // For quotes > 32 chars, we search using the anchor prefix (32 chars) or token diff.
    const searchPattern = normQuote.length > 32 ? normQuote.slice(0, 32) : normQuote;
    const matchIndex = this.dmp.match_main(normClauseText, searchPattern, 0);

    if (matchIndex === -1) {
      // Secondary check: word-by-word token comparison across whole clause
      const directChanges = diffWords(normClauseText, normQuote, { ignoreCase: true });
      let matchedTokens = 0;
      for (const c of directChanges) {
        if (!c.added && !c.removed) matchedTokens += c.value.length;
      }
      const directScore = Number((matchedTokens / Math.max(1, normQuote.length)).toFixed(2));

      if (directScore >= 0.80) {
        return {
          clauseExists: true,
          quoteMatchesSource: true,
          flaggedTextInSubmission: true,
          tokenFidelityScore: directScore,
          matchedSourceExcerpt: normQuote,
          confidence: "confirmed",
          diffTokens: directChanges
        };
      }

      return {
        clauseExists: true,
        quoteMatchesSource: false,
        flaggedTextInSubmission: true,
        tokenFidelityScore: directScore,
        confidence: "low_confidence",
        rejectionReason: `Quoted text could not be found within Clause ${storedClause.clauseCode}. Potential hallucination.`,
        diffTokens: directChanges
      };
    }

    // Extract window around matched region and compare word-by-word token fidelity
    const candidateSlice = normClauseText.substring(
      matchIndex,
      Math.min(normClauseText.length, matchIndex + normQuote.length + 30)
    );

    const changes = diffWords(candidateSlice, normQuote, { ignoreCase: true });
    let matchedChars = 0;
    const totalClaimedChars = normQuote.length;

    for (const change of changes) {
      if (!change.added && !change.removed) {
        matchedChars += change.value.length;
      }
    }

    const tokenFidelityScore = Number((matchedChars / Math.max(1, totalClaimedChars)).toFixed(2));

    if (tokenFidelityScore >= 0.85) {
      return {
        clauseExists: true,
        quoteMatchesSource: true,
        flaggedTextInSubmission: true,
        tokenFidelityScore,
        matchedSourceExcerpt: candidateSlice,
        confidence: "confirmed",
        diffTokens: changes
      };
    } else {
      return {
        clauseExists: true,
        quoteMatchesSource: false,
        flaggedTextInSubmission: true,
        tokenFidelityScore,
        confidence: "low_confidence",
        rejectionReason: `Quoted text diverges substantially from source clause text (Token fidelity ${Math.round(tokenFidelityScore * 100)}% < 85%).`,
        diffTokens: changes
      };
    }
  }

  /**
   * Filters and annotates a batch of findings according to Improvement A rules:
   * Confirmed citations pass; unverifiable citations are flagged as low_confidence or rejected.
   */
  public verifyAndFilterFindings(
    findings: Finding[],
    submissionText: string,
    storedClauses: Map<string, StoredClause>
  ): Finding[] {
    return findings
      .map((finding) => {
        const check = this.verifyFinding(
          {
            clauseId: finding.clauseId,
            exactQuote: finding.exactQuote,
            flaggedText: finding.flaggedText
          },
          submissionText,
          storedClauses
        );

        return {
          ...finding,
          confidence: check.confidence,
          isVerified: check.confidence === "confirmed",
          explanation:
            check.confidence === "low_confidence"
              ? `[Low Confidence Warning: ${check.rejectionReason}] ${finding.explanation}`
              : finding.explanation
        };
      })
      .filter((f) => f.confidence !== "rejected");
  }
}

function normalizeWhitespace(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}
