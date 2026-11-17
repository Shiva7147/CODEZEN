import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

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
      // Extract printable text chunks from PDF buffer
      const raw = buffer.toString("binary");
      const textMatches: string[] = [];
      
      // Extract PDF text between stream and endstream, or parentheses/brackets
      const regex = /\(([^)]+)\)|\[([^\]]+)\]/g;
      let match;
      while ((match = regex.exec(raw)) !== null) {
        const val = (match[1] || match[2] || "").trim();
        if (val.length > 2 && /[a-zA-Z]/.test(val) && !val.includes("\\")) {
          textMatches.push(val);
        }
      }

      if (textMatches.length > 10) {
        extractedText = textMatches.join(" ");
      } else {
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

    // Clean up whitespace
    extractedText = extractedText.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();

    if (!extractedText) {
      extractedText = `[Uploaded: ${filename}]\nNo readable text could be extracted from this file. Please ensure it is an unencrypted document.`;
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
