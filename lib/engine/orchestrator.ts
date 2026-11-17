import { Finding, ReadabilityReport } from "./types";
import { runDeterministicChecks } from "./rules";
import { runAIReview } from "./ai/gemini-reviewer";
import { CitationVerifier } from "./verification/citation-verifier";
import { RiskEscalationRouter, EscalationDecision } from "./escalation/risk-router";
import { AEGIS_BRAND_GUIDELINE_CLAUSES, CLAUSE_DATABASE_MAP } from "../data/sample-brand-guidelines";
import { GovernanceStateMachine, AuditRecord, SubmissionStatus } from "../workflow/workflow-engine";

export interface FullReviewInput {
  submissionId: string;
  title: string;
  rawText: string;
  statedIntent: string;
  targetChannel: string;
  docxBuffer?: Buffer;
}

export interface FullReviewOutput {
  submissionId: string;
  status: SubmissionStatus;
  findings: Finding[];
  readability: ReadabilityReport;
  escalationDecision: EscalationDecision;
  auditTrail: AuditRecord[];
  executionSummary: {
    totalFindings: number;
    sensitiveCount: number;
    routineCount: number;
    ruleCount: number;
    aiCount: number;
    verifiedPercentage: number;
    totalTimeMs: number;
  };
}

export async function executeGovernanceReview(
  input: FullReviewInput,
  stateMachine: GovernanceStateMachine = new GovernanceStateMachine()
): Promise<FullReviewOutput> {
  const overallStart = performance.now();

  // 1. Initial State Log
  stateMachine.logTransition({
    submissionId: input.submissionId,
    actorId: "usr_creator_01",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "SUBMISSION_CREATED",
    previousStatus: "DRAFT",
    newStatus: "ANALYZING",
    rationale: `Submitted draft "${input.title}" with stated intent: "${input.statedIntent}"`
  });

  // 2. Run Module 1: Deterministic Engine
  const deterministicResult = runDeterministicChecks(input.rawText, input.submissionId);

  // 3. Run Module 3: AI Review Engine
  const aiResult = await runAIReview(
    {
      submissionId: input.submissionId,
      rawText: input.rawText,
      statedIntent: input.statedIntent,
      targetChannel: input.targetChannel,
      retrievedClauses: AEGIS_BRAND_GUIDELINE_CLAUSES
    },
    CLAUSE_DATABASE_MAP
  );

  // 4. Combine findings and verify citations (Module 4)
  const combinedRawFindings = [...deterministicResult.findings, ...aiResult.findings];
  
  // Deduplicate overlapping findings on the same flagged text
  const seenKeys = new Set<string>();
  const dedupedFindings = combinedRawFindings.filter((f) => {
    const key = `${f.clauseCode}_${f.flaggedText.trim().toLowerCase()}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  const verifier = new CitationVerifier();
  const verifiedFindings = verifier.verifyAndFilterFindings(
    dedupedFindings,
    input.rawText,
    CLAUSE_DATABASE_MAP
  );

  // 5. Run Module 5: Risk Classification & Escalation Routing
  const router = new RiskEscalationRouter();
  const escalationDecision = router.routeFindings(verifiedFindings);

  // 6. Transition State Machine (Module 6)
  const finalStatus: SubmissionStatus = escalationDecision.requiresReviewerApproval
    ? "ESCALATED_TO_REVIEWER"
    : "IN_CREATOR_REVIEW";

  stateMachine.logTransition({
    submissionId: input.submissionId,
    actorId: "sys_verity_engine",
    actorName: "Verity Engine",
    actorRole: "ADMIN",
    action: escalationDecision.requiresReviewerApproval
      ? "SUBMISSION_ESCALATED"
      : "SUBMISSION_SUBMITTED_FOR_APPROVAL",
    previousStatus: "ANALYZING",
    newStatus: finalStatus,
    rationale: escalationDecision.escalationReason || "Automated hybrid analysis completed. Routing to creator review."
  });

  const totalTimeMs = Number((performance.now() - overallStart).toFixed(2));
  const verifiedCount = escalationDecision.annotatedFindings.filter((f) => f.isVerified).length;
  const verifiedPercentage =
    escalationDecision.annotatedFindings.length > 0
      ? Math.round((verifiedCount / escalationDecision.annotatedFindings.length) * 100)
      : 100;

  return {
    submissionId: input.submissionId,
    status: finalStatus,
    findings: escalationDecision.annotatedFindings,
    readability: deterministicResult.readability,
    escalationDecision,
    auditTrail: stateMachine.getAuditHistory(input.submissionId),
    executionSummary: {
      totalFindings: escalationDecision.annotatedFindings.length,
      sensitiveCount: escalationDecision.sensitiveFindingsCount,
      routineCount: escalationDecision.routineFindingsCount,
      ruleCount: deterministicResult.findings.length,
      aiCount: aiResult.findings.length,
      verifiedPercentage,
      totalTimeMs
    }
  };
}
