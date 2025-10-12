import fs from "fs";
import { createWorker } from "tesseract.js";

/**
 * Extract text from an uploaded file using Tesseract OCR (Node.js safe)
 * @param {Object} file - Multer file object
 * @param {string} file.path - path to the uploaded file
 * @returns {Promise<string>} recognized text
 */
export async function extractTextFromFile(file) {
  if (!file) throw new Error("No file provided");

  const worker = await createWorker();

  try {
    const { data } = await worker.recognize(file.path);
    return data.text
  } catch (err) {
    console.error("OCR failed:", err);
  } finally {
    await worker.terminate();
  }
}