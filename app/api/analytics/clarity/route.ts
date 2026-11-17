import { NextRequest, NextResponse } from "next/server";
import { AEGIS_BRAND_GUIDELINE_CLAUSES } from "@/lib/data/sample-brand-guidelines";
import { computeGuidelineClarityMetrics } from "@/lib/workflow/clarity-analytics";
import { AuditRecord } from "@/lib/workflow/workflow-engine";

export async function GET(req: NextRequest) {
  try {
    // Generate clarity metrics across the full guideline set
    const sampleEvents: AuditRecord[] = [
      {
        sequenceIndex: 0,
        timestamp: new Date().toISOString(),
        submissionId: "sub_demo_1",
        actorId: "usr_creator",
        actorName: "Rahul Sharma",
        actorRole: "CREATOR",
        action: "FINDING_DISPUTED",
        clauseId: "cl_style_01",
        clauseCode: "STYLE-1.2",
        rationale: "Urgency definition is ambiguous.",
        previousStatus: "IN_CREATOR_REVIEW",
        newStatus: "IN_CREATOR_REVIEW",
        previousHash: "000000",
        entryHash: "abc111"
      },
      {
        sequenceIndex: 1,
        timestamp: new Date().toISOString(),
        submissionId: "sub_demo_2",
        actorId: "usr_creator",
        actorName: "Rahul Sharma",
        actorRole: "CREATOR",
        action: "FINDING_ACCEPTED",
        clauseId: "cl_term_01",
        clauseCode: "TERM-1.1",
        previousStatus: "IN_CREATOR_REVIEW",
        newStatus: "IN_CREATOR_REVIEW",
        previousHash: "abc111",
        entryHash: "abc222"
      }
    ];

    const metrics = computeGuidelineClarityMetrics(
      AEGIS_BRAND_GUIDELINE_CLAUSES,
      sampleEvents
    );

    return NextResponse.json({
      metrics,
      totalClauses: metrics.length,
      ambiguousCount: metrics.filter((m) => m.clarityVerdict === "AMBIGUOUS_GUIDELINE").length,
      trainingCount: metrics.filter((m) => m.clarityVerdict === "TRAINING_NEED").length,
      highClarityCount: metrics.filter((m) => m.clarityVerdict === "HIGH_CLARITY").length
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load clarity analytics." },
      { status: 500 }
    );
  }
}
