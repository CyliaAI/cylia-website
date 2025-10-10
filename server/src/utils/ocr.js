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

  // Create a worker (no logger in Node)
  const worker = await createWorker();

  try {
    // Recognize text directly
    const { data } = await worker.recognize(file.path);

    return data.text;
  } finally {
    // Terminate worker
    await worker.terminate().catch((err) => console.error("Worker terminate failed:", err));

    // Delete uploaded file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });
  }
}