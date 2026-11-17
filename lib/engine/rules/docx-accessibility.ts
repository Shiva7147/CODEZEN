import JSZip from "jszip";
import { DOMParser } from "@xmldom/xmldom";
import { Finding, ImageAltReport } from "../types";

export async function checkDocxImageAltText(
  docxBuffer: Buffer,
  submissionId: string = "sub_demo"
): Promise<{ reports: ImageAltReport[]; findings: Finding[] }> {
  const reports: ImageAltReport[] = [];
  const findings: Finding[] = [];

  try {
    const zip = await JSZip.loadAsync(docxBuffer);
    const xmlFileNames = Object.keys(zip.files).filter(
      (name) =>
        name === "word/document.xml" ||
        name.startsWith("word/header") ||
        name.startsWith("word/footer")
    );

    const parser = new DOMParser();

    for (const fileName of xmlFileNames) {
      const xmlString = await zip.files[fileName].async("string");
      const doc = parser.parseFromString(xmlString, "application/xml");

      // In OOXML, drawing property objects are declared as <wp:docPr> or <a:docPr>
      const docPrList = doc.getElementsByTagNameNS("*", "docPr");

      for (let i = 0; i < docPrList.length; i++) {
        const el = docPrList[i];
        const id = el.getAttribute("id") || `img_${reports.length + 1}`;
        const name = el.getAttribute("name") || "Embedded Image";
        const descr = el.getAttribute("descr") || "";
        const title = el.getAttribute("title") || "";

        const altText = (descr || title).trim();
        const isPlaceholder = /^(picture\s*\d+|image\s*\d+|untitled|\w+\.(png|jpg|jpeg|gif))$/i.test(altText);
        const isAccessible = altText.length > 0 && !isPlaceholder;

        let issue: string | undefined;
        if (!altText) {
          issue = "Missing alt-text description on embedded image (WCAG 1.1.1 Non-text Content requirement).";
        } else if (isPlaceholder) {
          issue = `Generic filename placeholder detected as alt-text: "${altText}". Provide a functional description.`;
        }

        reports.push({
          imageId: id,
          name,
          altText,
          isAccessible,
          issue
        });

        if (!isAccessible) {
          findings.push({
            id: `find_acc_${id}_${Date.now()}`,
            submissionId,
            versionNumber: 1,
            clauseId: "cl_access_01",
            clauseCode: "ACCESS-1.2",
            flaggedText: `[Image: ${name}]`,
            exactQuote: "All inline graphics, figures, charts, and promotional photography must include non-empty, descriptive alternative text (alt text). Generic file names like 'image.png' are prohibited.",
            issueCategory: "accessibility",
            explanation: issue || "Image lacks compliant alternative text.",
            suggestedDiff: {
              original: `[Image: ${name}]`,
              replacement: `[Image: ${name} (Alt: "Diagram illustrating Aegis wellness verification architecture")]`
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
      }
    }
  } catch (err) {
    console.warn("Could not inspect DOCX archive for alt-text:", err);
  }

  return { reports, findings };
}
