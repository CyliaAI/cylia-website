import { Router } from "express";
import multer from "multer";
import { uploadFiles } from "../middlewares/uploadFiles.js";
import { extractTextFromFile } from "../utils/ocr.js";

const router = Router();

router.post("/", uploadFiles(1).single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text from the uploaded file
    const file = req.file;
    const extractedText = await extractTextFromFile(file);

    res.json({ text: extractedText });

  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Failed to process the file" });
  }
});

export default router;
