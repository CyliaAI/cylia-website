import { Router } from "express";
import multer from "multer";
import { extractTextFromFile } from "../utils/ocr.js";

const router = Router();
const upload = multer({ dest: "uploads/" }); // files stored in 'uploads' folder

/**
 * POST /upload
 * Receives a single file with key "file"
 */
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    console.log("Received file:", req.file.originalname);

    // Call OCR function
    const text = await extractTextFromFile(req.file);
    console.log("text",text);
    res.json({
      message: "File uploaded successfully",
      fileName: req.file.originalname,
      path: req.file.path,
      extractedText: text,
    });
  } catch (err) {
    console.error("OCR failed:", err);
    res.status(500).json({ message: "OCR failed", error: err.message });
  }
});

export default router;
