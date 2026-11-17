import { StoredClause } from "../verification/citation-verifier";

export interface ParsedGuidelineSource {
  title: string;
  sourceType: "pdf" | "docx" | "markdown";
  isRestricted: boolean;
  rawText: string;
}

export function chunkGuidelineText(
  rawText: string,
  sourcePrefix: string = "GL"
): StoredClause[] {
  const clauses: StoredClause[] = [];

  // Match common numbered clause headers: e.g. "Section 1.1", "Clause 4.2", "1.1 Title", "Rule 3:"
  const lines = rawText.split("\n");
  let currentSectionHeading = "General Brand Guidance";
  let currentClauseCode = `${sourcePrefix}-1.0`;
  let currentParagraphs: string[] = [];
  let clauseCounter = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect major section headings (# Heading or Section X:)
    const sectionMatch = trimmed.match(/^(?:#+\s*|Section\s+\d+[:.-]?\s*)([^\n]+)/i);
    if (sectionMatch) {
      if (currentParagraphs.length > 0) {
        clauses.push({
          id: `cl_${sourcePrefix.toLowerCase()}_${clauseCounter}`,
          clauseCode: currentClauseCode,
          sectionHeading: currentSectionHeading,
          clauseText: currentParagraphs.join("\n\n")
        });
        clauseCounter++;
        currentParagraphs = [];
      }
      currentSectionHeading = sectionMatch[1].trim();
      continue;
    }

    // Detect numbered rule / clause boundaries (e.g. "1.1", "Rule 2:", "Clause 3.4")
    const clauseMatch = trimmed.match(/^(?:(?:Rule|Clause)\s+)?(\d+\.\d+)(?:\s*[:.-]?\s*)([^\n]*)/i);
    if (clauseMatch) {
      if (currentParagraphs.length > 0) {
        clauses.push({
          id: `cl_${sourcePrefix.toLowerCase()}_${clauseCounter}`,
          clauseCode: currentClauseCode,
          sectionHeading: currentSectionHeading,
          clauseText: currentParagraphs.join("\n\n")
        });
        clauseCounter++;
        currentParagraphs = [];
      }
      currentClauseCode = `${sourcePrefix}-${clauseMatch[1]}`;
      if (clauseMatch[2]) {
        currentParagraphs.push(clauseMatch[2].trim());
      }
      continue;
    }

    currentParagraphs.push(trimmed);
  }

  // Push remaining buffer
  if (currentParagraphs.length > 0) {
    clauses.push({
      id: `cl_${sourcePrefix.toLowerCase()}_${clauseCounter}`,
      clauseCode: currentClauseCode,
      sectionHeading: currentSectionHeading,
      clauseText: currentParagraphs.join("\n\n")
    });
  }

  return clauses;
}
