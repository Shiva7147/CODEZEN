import { NextRequest, NextResponse } from "next/server";
import { chunkGuidelineText } from "@/lib/engine/ingestion/clause-chunker";
import { parseDocxBuffer } from "@/lib/engine/ingestion/docx-parser";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const title = (formData.get("title") as string) || file?.name || "Uploaded Brand Guidelines";

      if (!file) {
        return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      let extractedText = "";

      if (file.name.endsWith(".docx")) {
        const parsed = await parseDocxBuffer(buffer);
        extractedText = parsed.rawText;
      } else {
        extractedText = buffer.toString("utf-8");
      }

      const clauses = chunkGuidelineText(extractedText, "UPLOAD");

      return NextResponse.json({
        title,
        extractedLength: extractedText.length,
        clauseCount: clauses.length,
        clauses
      });
    }

    const body = await req.json();
    if (!body.rawText) {
      return NextResponse.json({ error: "rawText string is required." }, { status: 400 });
    }

    const clauses = chunkGuidelineText(body.rawText, body.prefix || "GUIDE");

    return NextResponse.json({
      title: body.title || "Uploaded Brand Guidelines",
      clauseCount: clauses.length,
      clauses
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to ingest brand guidelines." },
      { status: 500 }
    );
  }
}
