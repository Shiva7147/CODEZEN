import { fleschKincaid } from "flesch-kincaid";
import { syllable } from "syllable";
import { Finding, ReadabilityReport } from "../types";

export function analyzeReadability(text: string): ReadabilityReport {
  // Normalize and split sentences
  const rawSentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const words = text.match(/\b[A-Za-z0-9'-]+\b/g) || [];

  const wordCount = Math.max(1, words.length);
  const sentenceCount = Math.max(1, rawSentences.length);

  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += Math.max(1, syllable(word));
  }

  const counts = {
    word: wordCount,
    sentence: sentenceCount,
    syllable: totalSyllables
  };

  const gradeLevel = Number(fleschKincaid(counts).toFixed(1));

  // Standard Flesch Reading Ease formula:
  // 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const readingEaseScore = Math.max(
    0,
    Math.min(
      100,
      Number(
        (
          206.835 -
          1.015 * (wordCount / sentenceCount) -
          84.6 * (totalSyllables / wordCount)
        ).toFixed(1)
      )
    )
  );

  let verdict: ReadabilityReport["verdict"] = "Standard";
  if (readingEaseScore >= 80) verdict = "Very Easy";
  else if (readingEaseScore >= 65) verdict = "Standard";
  else if (readingEaseScore >= 50) verdict = "Fairly Difficult";
  else if (readingEaseScore >= 30) verdict = "Difficult";
  else verdict = "Very Confusing";

  // Identify run-on sentences (> 30 words)
  const longSentences = rawSentences
    .map((sentence, index) => {
      const sentenceWords = sentence.match(/\b[A-Za-z0-9'-]+\b/g) || [];
      return {
        sentence,
        wordCount: sentenceWords.length,
        index
      };
    })
    .filter((s) => s.wordCount > 30);

  return {
    score: readingEaseScore,
    gradeLevel,
    sentenceCount,
    wordCount,
    syllableCount: totalSyllables,
    verdict,
    longSentences
  };
}

export function checkReadabilityFindings(
  text: string,
  submissionId: string = "sub_demo",
  maxGradeLevel: number = 9.0
): Finding[] {
  const findings: Finding[] = [];
  const report = analyzeReadability(text);

  // If entire document exceeds corporate target grade level (Grade 9)
  if (report.gradeLevel > maxGradeLevel) {
    findings.push({
      id: `find_read_grade_${Date.now()}`,
      submissionId,
      versionNumber: 1,
      clauseId: "cl_style_02",
      clauseCode: "STYLE-2.1",
      flaggedText: text.slice(0, 120) + "...",
      exactQuote: "All public-facing communications must target an 8th-to-9th grade reading level (Flesch Grade Level ≤ 9.0) to ensure broad comprehension.",
      issueCategory: "readability",
      explanation: `Content readability score is currently at Grade ${report.gradeLevel} (${report.verdict}). Simplify sentence structure and reduce multisyllabic vocabulary.`,
      suggestedDiff: {
        original: text.slice(0, 80) + "...",
        replacement: "Simplify complex terms and break compound sentences into direct statements."
      },
      severity: "ROUTINE",
      confidence: "confirmed",
      isVerified: true,
      status: "OPEN",
      assignedRole: "CREATOR",
      sourceType: "rule",
      createdAt: new Date().toISOString()
    });
  }

  // Flag individual run-on sentences
  for (const item of report.longSentences.slice(0, 3)) {
    findings.push({
      id: `find_read_len_${item.index}_${Date.now()}`,
      submissionId,
      versionNumber: 1,
      clauseId: "cl_style_03",
      clauseCode: "STYLE-2.3",
      flaggedText: item.sentence,
      exactQuote: "Sentences must not exceed 30 words. Break long, multi-clause thoughts into concise individual statements.",
      issueCategory: "readability",
      explanation: `Sentence contains ${item.wordCount} words (exceeds 30-word maximum threshold). Splitting into two sentences will improve clarity.`,
      suggestedDiff: {
        original: item.sentence,
        replacement: item.sentence.replace(/,\s*(and|which|furthermore|whereas)\s*/i, ". ")
      },
      severity: "ROUTINE",
      confidence: "confirmed",
      isVerified: true,
      status: "OPEN",
      assignedRole: "CREATOR",
      sourceType: "rule",
      createdAt: new Date().toISOString()
    });
  }

  return findings;
}
