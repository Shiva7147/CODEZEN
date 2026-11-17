import { Finding } from "../types";

export interface TermDictionaryItem {
  bannedTerm: string;
  preferredTerm: string;
  clauseId: string;
  clauseCode: string;
  exactQuote: string;
  explanation: string;
}

// Default corporate terminology dictionary for Aegis BioHealth & Wealth
export const DEFAULT_TERMINOLOGY_DICT: TermDictionaryItem[] = [
  {
    bannedTerm: "cure",
    preferredTerm: "support management of",
    clauseId: "cl_term_01",
    clauseCode: "TERM-1.1",
    exactQuote: "Do not state or imply that any Aegis product can cure, eradicate, or permanently eliminate chronic conditions.",
    explanation: "Regulatory restriction: The term 'cure' violates compliance mandates. Use approved descriptive phrasing such as 'support management of'."
  },
  {
    bannedTerm: "100% guaranteed",
    preferredTerm: "statistically correlated",
    clauseId: "cl_term_02",
    clauseCode: "TERM-2.4",
    exactQuote: "Never use absolute guarantee phrasing like '100% guaranteed' or 'risk-free returns'.",
    explanation: "Absolute guarantee language is legally prohibited without registered underwritten warranty."
  },
  {
    bannedTerm: "miracle",
    preferredTerm: "scientifically backed",
    clauseId: "cl_term_03",
    clauseCode: "TERM-3.2",
    exactQuote: "Hyperbolic sensational terms such as 'miracle', 'breakthrough secret', or 'magic solution' are prohibited.",
    explanation: "Sensationalist language conflicts with Aegis professional and grounded brand tone guidelines."
  },
  {
    bannedTerm: "cheap",
    preferredTerm: "cost-effective",
    clauseId: "cl_term_04",
    clauseCode: "TERM-4.5",
    exactQuote: "Refer to pricing structures as 'accessible', 'cost-effective', or 'value-driven'. Never use 'cheap'.",
    explanation: "Term degrades brand premium perception."
  },
  {
    bannedTerm: "users",
    preferredTerm: "members",
    clauseId: "cl_term_05",
    clauseCode: "TERM-5.1",
    exactQuote: "Aegis platform participants are exclusively referred to as 'members' or 'clients', never 'users'.",
    explanation: "Community brand identity requirement."
  }
];

export function checkBannedTerms(
  text: string,
  submissionId: string = "sub_demo",
  dictionary: TermDictionaryItem[] = DEFAULT_TERMINOLOGY_DICT
): Finding[] {
  const findings: Finding[] = [];

  for (const item of dictionary) {
    const regex = new RegExp(`\\b${escapeRegExp(item.bannedTerm)}\\b`, "gi");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const flaggedText = match[0];
      const isSensitive = item.bannedTerm.toLowerCase() === "cure" || item.bannedTerm.toLowerCase() === "100% guaranteed";

      findings.push({
        id: `find_term_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        submissionId,
        versionNumber: 1,
        clauseId: item.clauseId,
        clauseCode: item.clauseCode,
        flaggedText,
        exactQuote: item.exactQuote,
        issueCategory: "terminology",
        explanation: item.explanation,
        suggestedDiff: {
          original: flaggedText,
          replacement: item.preferredTerm
        },
        severity: isSensitive ? "SENSITIVE" : "ROUTINE",
        confidence: "confirmed",
        isVerified: true,
        status: "OPEN",
        assignedRole: isSensitive ? "REVIEWER" : "CREATOR",
        sourceType: "rule",
        createdAt: new Date().toISOString()
      });
    }
  }

  return findings;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
