import mammoth from "mammoth";

export interface ParsedDocx {
  rawText: string;
  html: string;
  embeddedImagesCount: number;
}

export async function parseDocxBuffer(buffer: Buffer): Promise<ParsedDocx> {
  let imagesCount = 0;

  const htmlResult = await mammoth.convertToHtml(
    { buffer },
    {
      convertImage: mammoth.images.imgElement(async () => {
        imagesCount++;
        return { src: `placeholder_image_${imagesCount}.png` };
      })
    }
  );

  const textResult = await mammoth.extractRawText({ buffer });

  return {
    rawText: textResult.value,
    html: htmlResult.value,
    embeddedImagesCount: imagesCount
  };
}
