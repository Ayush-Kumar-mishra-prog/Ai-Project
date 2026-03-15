import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Function to extract text from PDF buffer using pdfjs-dist library

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
