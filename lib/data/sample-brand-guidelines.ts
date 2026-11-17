import { StoredClause } from "../engine/verification/citation-verifier";

export const AEGIS_BRAND_GUIDELINE_CLAUSES: StoredClause[] = [
  {
    id: "cl_term_01",
    clauseCode: "TERM-1.1",
    sectionHeading: "Terminology & Product Disclosures",
    clauseText: "Do not state or imply that any Aegis product can cure, eradicate, or permanently eliminate chronic conditions. Approved phrasing: 'supports metabolic vitality' or 'formulated to assist in active management'."
  },
  {
    id: "cl_term_02",
    clauseCode: "TERM-2.4",
    sectionHeading: "Financial Risk & Guarantees",
    clauseText: "Never use absolute guarantee phrasing like '100% guaranteed' or 'risk-free returns'. Past portfolio performance is never an indicator of future results."
  },
  {
    id: "cl_term_03",
    clauseCode: "TERM-3.2",
    sectionHeading: "Brand Tone & Phrasing",
    clauseText: "Hyperbolic sensational terms such as 'miracle', 'breakthrough secret', or 'magic solution' are prohibited. Aegis copy must project measured scientific rigor and calm confidence."
  },
  {
    id: "cl_term_04",
    clauseCode: "TERM-4.5",
    sectionHeading: "Commercial & Pricing Representation",
    clauseText: "Refer to pricing structures as 'accessible', 'cost-effective', or 'value-driven'. Never use 'cheap', 'budget', or 'dirt-cheap'."
  },
  {
    id: "cl_term_05",
    clauseCode: "TERM-5.1",
    sectionHeading: "Nomenclature & Identity",
    clauseText: "Aegis platform participants are exclusively referred to as 'members' or 'clients', never 'users' or 'consumers'."
  },
  {
    id: "cl_claim_01",
    clauseCode: "CLAIM-1.3",
    sectionHeading: "Comparative & Superlative Claims",
    clauseText: "Do not use unqualified superlative claims such as 'world's best' or 'unrivaled' unless accompanied by verifiable independent third-party market study citations approved by Legal."
  },
  {
    id: "cl_claim_02",
    clauseCode: "CLAIM-2.1",
    sectionHeading: "Capital & Yield Representations",
    clauseText: "Financial services promotions must strictly avoid any guarantee of returns or capital preservation without approved statutory risk disclaimers placed adjacent to the headline."
  },
  {
    id: "cl_claim_03",
    clauseCode: "CLAIM-3.4",
    sectionHeading: "Clinical Evidence Substantiation",
    clauseText: "Health claims must reference published peer-reviewed clinical trials and carry appropriate regulatory advisory disclaimers. Anecdotal customer quotes may not replace statistical efficacy data."
  },
  {
    id: "cl_style_01",
    clauseCode: "STYLE-1.2",
    sectionHeading: "Voice & Accessibility",
    clauseText: "The Aegis brand voice is calm, clear, and unhurried. Avoid hype words, urgency tricks ('Act now!', 'Don't miss out!'), and artificial excitement."
  },
  {
    id: "cl_style_02",
    clauseCode: "STYLE-2.1",
    sectionHeading: "Readability Standard",
    clauseText: "All public-facing communications must target an 8th-to-9th grade reading level (Flesch Grade Level ≤ 9.0) to ensure broad comprehension across diverse demographics."
  },
  {
    id: "cl_style_03",
    clauseCode: "STYLE-2.3",
    sectionHeading: "Sentence Construction",
    clauseText: "Sentences must not exceed 30 words. Break long, multi-clause thoughts into concise individual statements."
  },
  {
    id: "cl_access_01",
    clauseCode: "ACCESS-1.2",
    sectionHeading: "Digital Asset Accessibility",
    clauseText: "All inline graphics, figures, charts, and promotional photography must include non-empty, descriptive alternative text (alt text). Generic file names like 'image.png' are prohibited."
  }
];

export const CLAUSE_DATABASE_MAP = new Map<string, StoredClause>(
  AEGIS_BRAND_GUIDELINE_CLAUSES.map((c) => [c.id, c])
);
