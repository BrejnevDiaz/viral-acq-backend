// ─── Extraction de texte PDF (pdf-parse v2) ──────────────────────────────────
// pdf-parse v2 n'exporte plus une fonction mais une classe PDFParse
// (constructor({ data: Buffer }) → getText() → { text, total, pages }).
// Ce module isole cet interop : server.js et bulkIngest.js l'utilisent tous
// les deux, et si la lib change encore d'API il n'y a qu'un endroit à corriger.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

/**
 * @param {Buffer} buffer - Contenu binaire du PDF
 * @returns {Promise<{ text: string, numpages: number }>}
 */
export async function extractPdfText(buffer) {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return { text: result.text || "", numpages: result.total || 0 };
  } finally {
    // Libère le document pdfjs sous-jacent (sinon le process peut rester ouvert)
    await parser.destroy().catch(() => {});
  }
}
