import crypto from "crypto";
import { Finding, FindingStatus, UserRole } from "../engine/types";

export type SubmissionStatus =
  | "DRAFT"
  | "ANALYZING"
  | "IN_CREATOR_REVIEW"
  | "PENDING_MANAGER_APPROVAL"
  | "ESCALATED_TO_REVIEWER"
  | "APPROVED"
  | "REVISION_REQUESTED";

export interface AuditRecord {
  sequenceIndex: number;
  timestamp: string;
  submissionId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action:
    | "SUBMISSION_CREATED"
    | "FINDING_ACCEPTED"
    | "FINDING_DISPUTED"
    | "FINDING_EDITED"
    | "SUBMISSION_ESCALATED"
    | "SUBMISSION_SUBMITTED_FOR_APPROVAL"
    | "REVISION_REQUESTED"
    | "SUBMISSION_APPROVED";
  findingId?: string;
  clauseId?: string;
  clauseCode?: string;
  rationale?: string;
  previousStatus: SubmissionStatus;
  newStatus: SubmissionStatus;
  previousHash: string;
  entryHash: string;
}

const AUDIT_SECRET = process.env.AUDIT_CHAIN_SECRET || "verity-audit-tamper-evident-salt";

export class GovernanceStateMachine {
  private auditLog: AuditRecord[] = [];

  constructor(initialAuditLog: AuditRecord[] = []) {
    this.auditLog = [...initialAuditLog];
  }

  public getAuditHistory(submissionId?: string): AuditRecord[] {
    if (!submissionId) return this.auditLog;
    return this.auditLog.filter((log) => log.submissionId === submissionId);
  }

  /**
   * Appends an immutable cryptographic entry to the audit log.
   */
  public logTransition(params: {
    submissionId: string;
    actorId: string;
    actorName: string;
    actorRole: UserRole;
    action: AuditRecord["action"];
    findingId?: string;
    clauseId?: string;
    clauseCode?: string;
    rationale?: string;
    previousStatus: SubmissionStatus;
    newStatus: SubmissionStatus;
  }): AuditRecord {
    const prevRecord = this.auditLog[this.auditLog.length - 1];
    const previousHash = prevRecord
      ? prevRecord.entryHash
      : "GENESIS_BLOCK_0000000000000000000000000000000000000000000000000000000000000000";

    const timestamp = new Date().toISOString();
    const sequenceIndex = this.auditLog.length;

    const payloadToHash = [
      previousHash,
      sequenceIndex,
      timestamp,
      params.submissionId,
      params.actorId,
      params.actorRole,
      params.action,
      params.findingId || "",
      params.clauseId || "",
      params.rationale || "",
      params.previousStatus,
      params.newStatus
    ].join("|");

    const entryHash = crypto
      .createHmac("sha256", AUDIT_SECRET)
      .update(payloadToHash)
      .digest("hex");

    const newRecord: AuditRecord = {
      sequenceIndex,
      timestamp,
      submissionId: params.submissionId,
      actorId: params.actorId,
      actorName: params.actorName,
      actorRole: params.actorRole,
      action: params.action,
      findingId: params.findingId,
      clauseId: params.clauseId,
      clauseCode: params.clauseCode,
      rationale: params.rationale,
      previousStatus: params.previousStatus,
      newStatus: params.newStatus,
      previousHash,
      entryHash
    };

    this.auditLog.push(newRecord);
    return newRecord;
  }

  /**
   * Verifies the cryptographic integrity of the entire audit chain.
   */
  public verifyAuditChainIntegrity(): { isValid: boolean; brokenAtSequence?: number } {
    for (let i = 0; i < this.auditLog.length; i++) {
      const current = this.auditLog[i];
      const expectedPrevHash =
        i === 0
          ? "GENESIS_BLOCK_0000000000000000000000000000000000000000000000000000000000000000"
          : this.auditLog[i - 1].entryHash;

      if (current.previousHash !== expectedPrevHash) {
        return { isValid: false, brokenAtSequence: i };
      }

      const payloadToHash = [
        current.previousHash,
        current.sequenceIndex,
        current.timestamp,
        current.submissionId,
        current.actorId,
        current.actorRole,
        current.action,
        current.findingId || "",
        current.clauseId || "",
        current.rationale || "",
        current.previousStatus,
        current.newStatus
      ].join("|");

      const recalculatedHash = crypto
        .createHmac("sha256", AUDIT_SECRET)
        .update(payloadToHash)
        .digest("hex");

      if (recalculatedHash !== current.entryHash) {
        return { isValid: false, brokenAtSequence: i };
      }
    }

    return { isValid: true };
  }

  /**
   * State Machine Transition Logic
   */
  public handleFindingAction(params: {
    finding: Finding;
    actorRole: UserRole;
    action: "ACCEPT" | "DISPUTE" | "EDIT";
    rationale: string;
    newReplacementText?: string;
  }): { updatedFinding: Finding; error?: string } {
    const { finding, actorRole, action, rationale, newReplacementText } = params;

    // Security check: Creator cannot unilaterally dismiss or accept sensitive claims
    if (finding.severity === "SENSITIVE" && (action === "ACCEPT" || action === "DISPUTE")) {
      if (actorRole !== "REVIEWER" && actorRole !== "ADMIN") {
        return {
          updatedFinding: finding,
          error: "Permission Denied: Sensitive findings require sign-off by an Authorised Reviewer (Compliance/Legal)."
        };
      }
    }

    const updatedFinding: Finding = {
      ...finding,
      status: action === "ACCEPT" ? "ACCEPTED" : action === "DISPUTE" ? "DISPUTED" : "EDITED",
      creatorRationale: rationale
    };

    if (action === "EDIT" && newReplacementText) {
      updatedFinding.suggestedDiff = {
        original: finding.flaggedText,
        replacement: newReplacementText
      };
    }

    return { updatedFinding };
  }
}
