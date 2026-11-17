import { NextRequest, NextResponse } from "next/server";
import { executeGovernanceReview } from "@/lib/engine/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.rawText || !body.rawText.trim()) {
      return NextResponse.json(
        { error: "Content body is required for review." },
        { status: 400 }
      );
    }

    const output = await executeGovernanceReview({
      submissionId: body.submissionId || `sub_${Date.now()}`,
      title: body.title || "Untitled Submission",
      rawText: body.rawText,
      statedIntent: body.statedIntent || "General brand communication",
      targetChannel: body.targetChannel || "press_release"
    });

    return NextResponse.json(output);
  } catch (error: any) {
    console.error("Review API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process review." },
      { status: 500 }
    );
  }
}
