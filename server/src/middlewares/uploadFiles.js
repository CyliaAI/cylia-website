import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Storage Configuration
const defaultStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads/')) fs.mkdirSync('uploads/');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.body.id}_${req.body.documentType}${path.extname(file.originalname).toLowerCase()}`
    );
  },
});

// Upload Files Middleware
export function uploadFiles() {
  return multer({
    storage: defaultStorage
  });
}