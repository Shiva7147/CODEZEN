export type FindingSeverity = "ROUTINE" | "SENSITIVE";
export type FindingConfidence = "confirmed" | "low_confidence" | "rejected";
export type FindingStatus = "OPEN" | "ACCEPTED" | "DISPUTED" | "EDITED";
export type UserRole = "CREATOR" | "MANAGER" | "REVIEWER" | "ADMIN";

export interface Finding {
  id: string;
  submissionId: string;
  versionNumber: number;
  clauseId: string;
  clauseCode: string;
  flaggedText: string;
  exactQuote: string;
  issueCategory: "terminology" | "readability" | "accessibility" | "tone" | "unsupported_claim" | "promotional_guarantee";
  explanation: string;
  suggestedDiff: {
    original: string;
    replacement: string;
  };
  severity: FindingSeverity;
  confidence: FindingConfidence;
  isVerified: boolean;
  status: FindingStatus;
  assignedRole: UserRole;
  creatorRationale?: string;
  sourceType: "rule" | "ai";
  createdAt: string;
}

export interface ReadabilityReport {
  score: number; // 0-100 Reading Ease
  gradeLevel: number; // US school grade
  sentenceCount: number;
  wordCount: number;
  syllableCount: number;
  verdict: "Very Easy" | "Standard" | "Fairly Difficult" | "Difficult" | "Very Confusing";
  longSentences: Array<{
    sentence: string;
    wordCount: number;
    index: number;
  }>;
}

export interface ImageAltReport {
  imageId: string;
  name: string;
  altText: string;
  isAccessible: boolean;
  issue?: string;
}
