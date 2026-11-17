import { NextRequest, NextResponse } from "next/server";
import { GovernanceStateMachine } from "@/lib/workflow/workflow-engine";
import { Finding, UserRole } from "@/lib/engine/types";

// In-memory global state machine instance for session persistence
const globalStateMachine = new GovernanceStateMachine();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, finding, actorRole, action, rationale, newReplacementText, actorName, actorId } = body;

    if (!finding || !action || !actorRole) {
      return NextResponse.json(
        { error: "Finding, action, and actorRole are required." },
        { status: 400 }
      );
    }

    const result = globalStateMachine.handleFindingAction({
      finding: finding as Finding,
      actorRole: actorRole as UserRole,
      action: action as "ACCEPT" | "DISPUTE" | "EDIT",
      rationale: rationale || `Action ${action} by ${actorName || actorRole}`,
      newReplacementText
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
    }

    const actionType =
      action === "ACCEPT"
        ? "FINDING_ACCEPTED"
        : action === "DISPUTE"
        ? "FINDING_DISPUTED"
        : "FINDING_EDITED";

    const auditRecord = globalStateMachine.logTransition({
      submissionId: submissionId || "sub_active",
      actorId: actorId || "usr_active",
      actorName: actorName || "Active User",
      actorRole: actorRole as UserRole,
      action: actionType,
      findingId: finding.id,
      clauseId: finding.clauseId,
      clauseCode: finding.clauseCode,
      rationale,
      previousStatus: "IN_CREATOR_REVIEW",
      newStatus: "IN_CREATOR_REVIEW"
    });

    return NextResponse.json({
      updatedFinding: result.updatedFinding,
      auditRecord,
      auditTrail: globalStateMachine.getAuditHistory(submissionId)
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process finding action." },
      { status: 500 }
    );
  }
}
