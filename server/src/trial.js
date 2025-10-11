import { createWorker } from "tesseract.js";
import path from "path";

async function runOCR(imagePath) {
  // Create worker
  const worker = await createWorker();

  try {
    await worker.load();

    const { data } = await worker.recognize(imagePath);
    console.log("OCR Result:\n", data.text);
  } catch (err) {
    console.error("OCR failed:", err);
  } finally {
    await worker.terminate();
  }
}

// Example usage
const imageFile = path.resolve("./Nuclear_Gandhi.png");
runOCR(imageFile);

