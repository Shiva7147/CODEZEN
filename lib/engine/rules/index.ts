import { Finding, ReadabilityReport } from "../types";
import { checkBannedTerms, TermDictionaryItem } from "./banned-terms";
import { checkReadabilityFindings, analyzeReadability } from "./readability";
import { checkRiskPatterns } from "./risk-patterns";

export interface DeterministicReviewResult {
  findings: Finding[];
  readability: ReadabilityReport;
  executionTimeMs: number;
}

export function runDeterministicChecks(
  text: string,
  submissionId: string = "sub_demo",
  customDictionary?: TermDictionaryItem[]
): DeterministicReviewResult {
  const startTime = performance.now();

  const termFindings = checkBannedTerms(text, submissionId, customDictionary);
  const readabilityReport = analyzeReadability(text);
  const readabilityFindings = checkReadabilityFindings(text, submissionId);
  const riskFindings = checkRiskPatterns(text, submissionId);

  const findings = [...termFindings, ...readabilityFindings, ...riskFindings];
  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

  return {
    findings,
    readability: readabilityReport,
    executionTimeMs
  };
}

export * from "./banned-terms";
export * from "./readability";
export * from "./risk-patterns";
export * from "./docx-accessibility";
