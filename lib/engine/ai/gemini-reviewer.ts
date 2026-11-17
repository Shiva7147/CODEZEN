import { GoogleGenAI } from "@google/genai";
import { Finding } from "../types";
import { StoredClause, CitationVerifier } from "../verification/citation-verifier";

export interface AIReviewRequest {
  submissionId: string;
  rawText: string;
  statedIntent: string;
  targetChannel: string;
  retrievedClauses: StoredClause[];
}

export interface AIReviewResponse {
  findings: Finding[];
  executiveSummary: string;
  executionTimeMs: number;
  modelUsed: string;
  isMockMode: boolean;
}

export async function runAIReview(
  request: AIReviewRequest,
  clauseMap: Map<string, StoredClause>
): Promise<AIReviewResponse> {
  const startTime = performance.now();
  const apiKey = process.env.GEMINI_API_KEY;
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !apiKey;

  // Law 5: Instant Demo Insurance Fallback if no API key or in Demo Mode
  if (isDemoMode) {
    return runMockFallbackReview(request, clauseMap, startTime);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const clausesPrompt = request.retrievedClauses
      .map((c) => `[Clause ID: ${c.id} | Code: ${c.clauseCode} | Section: ${c.sectionHeading}]\n${c.clauseText}`)
      .join("\n\n");

    const systemInstruction = `You are Verity's Brand Governance Reviewer.
Analyze the submitted content strictly against the provided approved brand clauses.
Do not hallucinate clauses. You must only cite Clause IDs that are explicitly provided in the context.
For each finding, provide:
1. flagged_text: The exact substring in the submission that violates the clause.
2. clause_id: The exact Clause ID provided in context.
3. exact_quote: An exact verbatim quote from that clause supporting your finding.
4. issue_category: One of ["tone", "unsupported_claim", "promotional_guarantee", "terminology"].
5. explanation: Objective explanation of why it violates the clause.
6. suggested_replacement: An intent-preserving rewrite that keeps the creator's purpose while becoming compliant.
7. severity: "SENSITIVE" for unsupported claims, superlatives, or guarantees; "ROUTINE" for minor tone or style issues.`;

    const userPrompt = `Creator's Stated Purpose: "${request.statedIntent}"
Target Publication Channel: "${request.targetChannel}"

Approved Brand Guideline Clauses:
${clausesPrompt}

Submitted Content to Review:
"${request.rawText}"`;

    const interaction = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `${systemInstruction}\n\n${userPrompt}`,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const parsed = JSON.parse(interaction.text || "{}");
    const rawFindings = Array.isArray(parsed.findings) ? parsed.findings : [];

    const mappedFindings: Finding[] = rawFindings.map((item: any) => {
      const storedClause = clauseMap.get(item.clause_id);
      return {
        id: `find_ai_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        submissionId: request.submissionId,
        versionNumber: 1,
        clauseId: item.clause_id,
        clauseCode: storedClause?.clauseCode || item.clause_code || "REF",
        flaggedText: item.flagged_text || "",
        exactQuote: item.exact_quote || "",
        issueCategory: item.issue_category || "unsupported_claim",
        explanation: item.explanation || "",
        suggestedDiff: {
          original: item.flagged_text || "",
          replacement: item.suggested_replacement || ""
        },
        severity: item.severity === "SENSITIVE" ? "SENSITIVE" : "ROUTINE",
        confidence: "confirmed",
        isVerified: true,
        status: "OPEN",
        assignedRole: item.severity === "SENSITIVE" ? "REVIEWER" : "CREATOR",
        sourceType: "ai",
        createdAt: new Date().toISOString()
      };
    });

    // Run through Module 4: Citation Verifier Gatekeeper
    const verifier = new CitationVerifier();
    const verifiedFindings = verifier.verifyAndFilterFindings(
      mappedFindings,
      request.rawText,
      clauseMap
    );

    return {
      findings: verifiedFindings,
      executiveSummary: parsed.executive_summary || "Automated review completed with citation verification.",
      executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
      modelUsed: "gemini-3.8-flash",
      isMockMode: false
    };
  } catch (error) {
    console.warn("Gemini API call failed, falling back to Demo Insurance:", error);
    return runMockFallbackReview(request, clauseMap, startTime);
  }
}

/**
 * Law 5 Demo Insurance: Fast, deterministic simulation
 */
function runMockFallbackReview(
  request: AIReviewRequest,
  clauseMap: Map<string, StoredClause>,
  startTime: number
): AIReviewResponse {
  const simulatedFindings: Finding[] = [];

  // Simulate tone check against STYLE-1.2
  if (/miracle|revolutionary|magic/i.test(request.rawText)) {
    const clause = clauseMap.get("cl_term_03");
    if (clause) {
      simulatedFindings.push({
        id: `find_mock_${Date.now()}_1`,
        submissionId: request.submissionId,
        versionNumber: 1,
        clauseId: clause.id,
        clauseCode: clause.clauseCode,
        flaggedText: "miracle",
        exactQuote: clause.clauseText.slice(0, 95),
        issueCategory: "tone",
        explanation: "Sensationalist tone detected. Conflicts with the calm, scientific tone requirement of Aegis brand guidelines.",
        suggestedDiff: {
          original: "miracle",
          replacement: "evidence-backed"
        },
        severity: "ROUTINE",
        confidence: "confirmed",
        isVerified: true,
        status: "OPEN",
        assignedRole: "CREATOR",
        sourceType: "ai",
        createdAt: new Date().toISOString()
      });
    }
  }

  // Simulate medical efficacy check against CLAIM-3.4
  if (/cure|eliminates? disease/i.test(request.rawText)) {
    const clause = clauseMap.get("cl_claim_03");
    if (clause) {
      simulatedFindings.push({
        id: `find_mock_${Date.now()}_2`,
        submissionId: request.submissionId,
        versionNumber: 1,
        clauseId: clause.id,
        clauseCode: clause.clauseCode,
        flaggedText: "clinically proven to cure",
        exactQuote: clause.clauseText.slice(0, 105),
        issueCategory: "unsupported_claim",
        explanation: "Unsubstantiated therapeutic claim lacks accompanying registered trial citation.",
        suggestedDiff: {
          original: "clinically proven to cure",
          replacement: "demonstrated in clinical studies to assist in managing"
        },
        severity: "SENSITIVE",
        confidence: "confirmed",
        isVerified: true,
        status: "OPEN",
        assignedRole: "REVIEWER",
        sourceType: "ai",
        createdAt: new Date().toISOString()
      });
    }
  }

  return {
    findings: simulatedFindings,
    executiveSummary: "Review completed using built-in deterministic demo fallback.",
    executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
    modelUsed: "gemini-3.8-flash (demo-mode)",
    isMockMode: true
  };
}
