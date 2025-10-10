import { Router, Request, Response } from "express";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" }); // files stored in 'uploads' folder

/**
 * POST /upload
 * Receives a single file with key "file"
 */
router.post("/", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Received file:", req.file.originalname);
  res.json({
    message: "File uploaded successfully",
    fileName: req.file.originalname,
    path: req.file.path,
  });
});

export default router;
