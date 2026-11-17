import { Finding } from "../types";

export interface RiskRulePattern {
  id: string;
  category: "superlative" | "financial_guarantee" | "health_claim";
  regex: RegExp;
  clauseId: string;
  clauseCode: string;
  exactQuote: string;
  explanation: string;
}

export const DETERMINISTIC_RISK_PATTERNS: RiskRulePattern[] = [
  {
    id: "risk_superlative",
    category: "superlative",
    regex: /\b(world'?s (?:best|greatest|most advanced)|unrivaled|incomparable|the only solution|undisputed #1)\b/gi,
    clauseId: "cl_claim_01",
    clauseCode: "CLAIM-1.3",
    exactQuote: "Do not use unqualified superlative claims such as 'world's best' or 'unrivaled' unless accompanied by verifiable independent third-party market study citations.",
    explanation: "Superlative claim requires formal substantiation documentation before publication."
  },
  {
    id: "risk_guarantee",
    category: "financial_guarantee",
    regex: /\b(guaranteed (?:returns?|growth|profit|yield)|risk[- ]free (?:investment|return)|100% safe capital)\b/gi,
    clauseId: "cl_claim_02",
    clauseCode: "CLAIM-2.1",
    exactQuote: "Financial services promotions must strictly avoid any guarantee of returns or capital preservation without approved statutory risk disclaimers.",
    explanation: "Financial guarantee language triggers mandatory regulatory escalation to Legal & Compliance."
  },
  {
    id: "risk_medical",
    category: "health_claim",
    regex: /\b(eliminates? disease|reverses? (?:aging|diabetes)|clinically proven to cure)\b/gi,
    clauseId: "cl_claim_03",
    clauseCode: "CLAIM-3.4",
    exactQuote: "Health claims must reference published peer-reviewed clinical trials and carry appropriate regulatory advisory disclaimers.",
    explanation: "Unsubstantiated therapeutic claim detected. Cannot be approved by content creator alone."
  }
];

export function checkRiskPatterns(
  text: string,
  submissionId: string = "sub_demo"
): Finding[] {
  const findings: Finding[] = [];

  for (const pattern of DETERMINISTIC_RISK_PATTERNS) {
    let match: RegExpExecArray | null;
    pattern.regex.lastIndex = 0;

    while ((match = pattern.regex.exec(text)) !== null) {
      const flaggedText = match[0];

      findings.push({
        id: `find_risk_${pattern.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        submissionId,
        versionNumber: 1,
        clauseId: pattern.clauseId,
        clauseCode: pattern.clauseCode,
        flaggedText,
        exactQuote: pattern.exactQuote,
        issueCategory: pattern.category === "superlative" ? "unsupported_claim" : "promotional_guarantee",
        explanation: pattern.explanation,
        suggestedDiff: {
          original: flaggedText,
          replacement: "State factual metrics supported by verified documentation (e.g. 'demonstrated in clinical testing')."
        },
        severity: "SENSITIVE", // Forces escalation
        confidence: "confirmed",
        isVerified: true,
        status: "OPEN",
        assignedRole: "REVIEWER", // Escalated to Authorised Reviewer
        sourceType: "rule",
        createdAt: new Date().toISOString()
      });
    }
  }

  return findings;
}
