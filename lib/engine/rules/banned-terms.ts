import { Finding } from "../types";

export interface TermDictionaryItem {
  bannedTerm: string;
  preferredTerm: string;
  clauseId: string;
  clauseCode: string;
  exactQuote: string;
  explanation: string;
  isSensitive?: boolean;
}

// Comprehensive corporate terminology dictionary for Aegis BioHealth, Wealth & Creator Marketing
export const DEFAULT_TERMINOLOGY_DICT: TermDictionaryItem[] = [
  // Sensitive Medical & Health Claims (quarantine for reviewer)
  {
    bannedTerm: "cure",
    preferredTerm: "support management of",
    clauseId: "cl_term_01",
    clauseCode: "TERM-1.1",
    exactQuote: "Do not state or imply that any Aegis product can cure, eradicate, or permanently eliminate chronic conditions.",
    explanation: "Regulatory restriction: The term 'cure' violates compliance mandates. Use approved descriptive phrasing such as 'support management of'.",
    isSensitive: true
  },
  {
    bannedTerm: "cures",
    preferredTerm: "supports management of",
    clauseId: "cl_term_01",
    clauseCode: "TERM-1.1",
    exactQuote: "Do not state or imply that any Aegis product can cure, eradicate, or permanently eliminate chronic conditions.",
    explanation: "Regulatory restriction: The term 'cures' violates compliance mandates.",
    isSensitive: true
  },
  {
    bannedTerm: "curing",
    preferredTerm: "supporting management of",
    clauseId: "cl_term_01",
    clauseCode: "TERM-1.1",
    exactQuote: "Do not state or imply that any Aegis product can cure, eradicate, or permanently eliminate chronic conditions.",
    explanation: "Regulatory restriction: Therapeutic cure claims are prohibited without registered clinical trials.",
    isSensitive: true
  },
  {
    bannedTerm: "eliminates disease",
    preferredTerm: "supports vitality and wellness",
    clauseId: "cl_claim_03",
    clauseCode: "CLAIM-3.4",
    exactQuote: "Health claims must reference published peer-reviewed clinical trials and carry appropriate regulatory advisory disclaimers.",
    explanation: "Disease elimination claims are strictly prohibited under consumer protection laws.",
    isSensitive: true
  },
  {
    bannedTerm: "eliminate disease",
    preferredTerm: "support vitality and wellness",
    clauseId: "cl_claim_03",
    clauseCode: "CLAIM-3.4",
    exactQuote: "Health claims must reference published peer-reviewed clinical trials and carry appropriate regulatory advisory disclaimers.",
    explanation: "Unsubstantiated therapeutic claim requires reviewer sign-off.",
    isSensitive: true
  },
  {
    bannedTerm: "reverses aging",
    preferredTerm: "supports cellular vitality",
    clauseId: "cl_claim_03",
    clauseCode: "CLAIM-3.4",
    exactQuote: "Health claims must reference published peer-reviewed clinical trials and carry appropriate regulatory advisory disclaimers.",
    explanation: "Anti-aging claims require qualified scientific substantiation.",
    isSensitive: true
  },
  {
    bannedTerm: "reverse aging",
    preferredTerm: "support cellular vitality",
    clauseId: "cl_claim_03",
    clauseCode: "CLAIM-3.4",
    exactQuote: "Health claims must reference published peer-reviewed clinical trials and carry appropriate regulatory advisory disclaimers.",
    explanation: "Anti-aging claims require qualified scientific substantiation.",
    isSensitive: true
  },

  // Sensitive Financial & Guarantee Claims
  {
    bannedTerm: "100% guaranteed",
    preferredTerm: "statistically correlated",
    clauseId: "cl_term_02",
    clauseCode: "TERM-2.4",
    exactQuote: "Never use absolute guarantee phrasing like '100% guaranteed' or 'risk-free returns'.",
    explanation: "Absolute guarantee language is legally prohibited without registered underwritten warranty.",
    isSensitive: true
  },
  {
    bannedTerm: "100% guarantee",
    preferredTerm: "statistically correlated outcome",
    clauseId: "cl_term_02",
    clauseCode: "TERM-2.4",
    exactQuote: "Never use absolute guarantee phrasing like '100% guaranteed' or 'risk-free returns'.",
    explanation: "Absolute guarantee language is legally prohibited without registered underwritten warranty.",
    isSensitive: true
  },
  {
    bannedTerm: "guaranteed returns",
    preferredTerm: "targeted historical yields",
    clauseId: "cl_claim_02",
    clauseCode: "CLAIM-2.1",
    exactQuote: "Financial services promotions must strictly avoid any guarantee of returns or capital preservation without approved statutory risk disclaimers.",
    explanation: "Guaranteed investment returns violate SEC and FTC financial marketing guidelines.",
    isSensitive: true
  },
  {
    bannedTerm: "guaranteed return",
    preferredTerm: "targeted historical yield",
    clauseId: "cl_claim_02",
    clauseCode: "CLAIM-2.1",
    exactQuote: "Financial services promotions must strictly avoid any guarantee of returns or capital preservation without approved statutory risk disclaimers.",
    explanation: "Guaranteed investment returns violate SEC and FTC financial marketing guidelines.",
    isSensitive: true
  },
  {
    bannedTerm: "risk-free",
    preferredTerm: "carefully hedged",
    clauseId: "cl_claim_02",
    clauseCode: "CLAIM-2.1",
    exactQuote: "Financial services promotions must strictly avoid any guarantee of returns or capital preservation without approved statutory risk disclaimers.",
    explanation: "Claims of zero financial risk violate regulatory investor protection rules.",
    isSensitive: true
  },
  {
    bannedTerm: "risk free",
    preferredTerm: "carefully managed",
    clauseId: "cl_claim_02",
    clauseCode: "CLAIM-2.1",
    exactQuote: "Financial services promotions must strictly avoid any guarantee of returns or capital preservation without approved statutory risk disclaimers.",
    explanation: "Claims of zero financial risk violate regulatory investor protection rules.",
    isSensitive: true
  },

  // Routine Superlatives & Exaggerations (1-Click Creator Fix)
  {
    bannedTerm: "miracle",
    preferredTerm: "scientifically backed",
    clauseId: "cl_term_03",
    clauseCode: "TERM-3.2",
    exactQuote: "Hyperbolic sensational terms such as 'miracle', 'breakthrough secret', or 'magic solution' are prohibited.",
    explanation: "Sensationalist language conflicts with Aegis professional and grounded brand tone guidelines."
  },
  {
    bannedTerm: "miraculous",
    preferredTerm: "evidence-backed",
    clauseId: "cl_term_03",
    clauseCode: "TERM-3.2",
    exactQuote: "Hyperbolic sensational terms such as 'miracle', 'breakthrough secret', or 'magic solution' are prohibited.",
    explanation: "Sensationalist language conflicts with Aegis professional and grounded brand tone guidelines."
  },
  {
    bannedTerm: "magic",
    preferredTerm: "innovative",
    clauseId: "cl_term_03",
    clauseCode: "TERM-3.2",
    exactQuote: "Hyperbolic sensational terms such as 'miracle', 'breakthrough secret', or 'magic solution' are prohibited.",
    explanation: "The term 'magic' trivializes scientific formulation and reduces brand trust."
  },
  {
    bannedTerm: "revolutionary",
    preferredTerm: "advanced formulation",
    clauseId: "cl_term_03",
    clauseCode: "TERM-3.2",
    exactQuote: "Hyperbolic sensational terms such as 'miracle', 'breakthrough secret', or 'magic solution' are prohibited.",
    explanation: "Overused hype term. Use measured descriptors like 'advanced' or 'formulated'."
  },
  {
    bannedTerm: "breakthrough",
    preferredTerm: "researched",
    clauseId: "cl_term_03",
    clauseCode: "TERM-3.2",
    exactQuote: "Hyperbolic sensational terms such as 'miracle', 'breakthrough secret', or 'magic solution' are prohibited.",
    explanation: "Requires verified comparative benchmark study."
  },
  {
    bannedTerm: "world's best",
    preferredTerm: "top-tier",
    clauseId: "cl_claim_01",
    clauseCode: "CLAIM-1.3",
    exactQuote: "Do not use unqualified superlative claims such as 'world's best' or 'unrivaled' unless accompanied by verifiable independent third-party market study citations.",
    explanation: "Unqualified superlative claim requires independent benchmark documentation."
  },
  {
    bannedTerm: "undisputed #1",
    preferredTerm: "industry-recognized",
    clauseId: "cl_claim_01",
    clauseCode: "CLAIM-1.3",
    exactQuote: "Do not use unqualified superlative claims such as 'world's best' or 'unrivaled' unless accompanied by verifiable independent third-party market study citations.",
    explanation: "Unsubstantiated ranking claims trigger regulatory scrutiny."
  },
  {
    bannedTerm: "the only solution",
    preferredTerm: "a dedicated approach",
    clauseId: "cl_claim_01",
    clauseCode: "CLAIM-1.3",
    exactQuote: "Do not use unqualified superlative claims such as 'world's best' or 'unrivaled' unless accompanied by verifiable independent third-party market study citations.",
    explanation: "Absolute exclusivity claims must be substantiated by market landscape audits."
  },

  // Pricing & Commercial Terminology
  {
    bannedTerm: "cheap",
    preferredTerm: "cost-effective",
    clauseId: "cl_term_04",
    clauseCode: "TERM-4.5",
    exactQuote: "Refer to pricing structures as 'accessible', 'cost-effective', or 'value-driven'. Never use 'cheap'.",
    explanation: "Term degrades brand premium perception."
  },
  {
    bannedTerm: "cheapest",
    preferredTerm: "most accessible",
    clauseId: "cl_term_04",
    clauseCode: "TERM-4.5",
    exactQuote: "Refer to pricing structures as 'accessible', 'cost-effective', or 'value-driven'. Never use 'cheap'.",
    explanation: "Use value-based descriptors instead of aggressive low-price claims."
  },
  {
    bannedTerm: "dirt-cheap",
    preferredTerm: "accessible",
    clauseId: "cl_term_04",
    clauseCode: "TERM-4.5",
    exactQuote: "Refer to pricing structures as 'accessible', 'cost-effective', or 'value-driven'. Never use 'cheap'.",
    explanation: "Colloquial price descriptor conflicts with brand tone standards."
  },

  // Audience & Community Terminology
  {
    bannedTerm: "users",
    preferredTerm: "members",
    clauseId: "cl_term_05",
    clauseCode: "TERM-5.1",
    exactQuote: "Aegis platform participants are exclusively referred to as 'members' or 'clients', never 'users'.",
    explanation: "Community brand identity requirement."
  },
  {
    bannedTerm: "user",
    preferredTerm: "member",
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
  const trackedMatches = new Set<string>();

  for (const item of dictionary) {
    // Robust regex that handles punctuation, special characters (like %), and boundaries safely
    const escaped = item.bannedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-zA-Z0-9_])(${escaped})([^a-zA-Z0-9_]|$)`, "gi");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const flaggedText = match[2];
      const matchIndex = match.index + match[1].length;
      const dedupeKey = `${matchIndex}_${flaggedText.toLowerCase()}`;

      if (trackedMatches.has(dedupeKey)) continue;
      trackedMatches.add(dedupeKey);

      const isSensitive = item.isSensitive === true;

      findings.push({
        id: `find_term_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        submissionId,
        versionNumber: 1,
        clauseId: item.clauseId,
        clauseCode: item.clauseCode,
        flaggedText,
        exactQuote: item.exactQuote,
        issueCategory: isSensitive ? "unsupported_claim" : "terminology",
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
