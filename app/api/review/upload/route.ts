import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data." },
        { status: 400 }
      );
    }

    const filename = file.name || "document.txt";
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    const lowerName = filename.toLowerCase();

    if (lowerName.endsWith(".docx")) {
      // Use mammoth for Word documents
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else if (lowerName.endsWith(".pdf")) {
      // Robust PDF extraction via PDFParse
      try {
        const parser = new PDFParse({ data: buffer });
        const parseResult = await parser.getText();
        extractedText = parseResult?.text || "";
      } catch (pdfErr) {
        console.warn("PDFParse load error, attempting buffer fallback:", pdfErr);
        // Fallback: clean ASCII printable characters
        let asciiStr = "";
        for (let i = 0; i < buffer.length; i++) {
          const byte = buffer[i];
          if (byte >= 32 && byte <= 126) asciiStr += String.fromCharCode(byte);
          else if (byte === 10 || byte === 13) asciiStr += "\n";
        }
        const lines = asciiStr
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 25 && !l.startsWith("/") && !l.includes("endobj") && !l.includes("stream"));
        extractedText = lines.join(" ");
      }
    } else {
      // Plain text, markdown, json, csv, rtf
      extractedText = buffer.toString("utf-8");
    }

    // Clean up whitespace & linebreaks
    extractedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    if (!extractedText) {
      extractedText = `[Uploaded: ${filename}]\nNo readable text could be extracted from this file. Please ensure it contains selectable text and is not encrypted.`;
    }

    const words = extractedText.split(/\s+/).filter(Boolean);
    const paragraphs = extractedText.split(/\n+/).filter(Boolean);

    return NextResponse.json({
      success: true,
      filename,
      text: extractedText,
      wordCount: words.length,
      paragraphCount: paragraphs.length,
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: `File extraction failed: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
