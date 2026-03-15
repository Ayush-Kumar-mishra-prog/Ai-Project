import { DOMMatrix, ImageData, Path2D } from "@napi-rs/canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Polyfill browser APIs required by pdfjs
global.DOMMatrix = DOMMatrix;
global.ImageData = ImageData;
global.Path2D = Path2D;

export const extractPdfText = async (buffer) => {
  const data = new Uint8Array(buffer);

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let documentText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item) => item.str).join(" ");

    documentText += pageText + "\n";
  }

  return documentText;
};