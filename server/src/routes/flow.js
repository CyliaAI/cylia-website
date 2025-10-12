import express from "express";
import { flowQueue } from "../workers/flowQueue.js";
import schedule from 'node-schedule';
import { uploadFiles } from "../middlewares/uploadFiles.js";
import validateBody from "../middlewares/validateBody.js";
import { pdf } from "pdf-to-img";

import path from "path";
import { promises as fs } from "fs";


const router = express.Router();

async function pdfImg(pdfPath) {
  const outputDir = path.join("uploads", `${path.basename(pdfPath)}_images`);

  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }


  const document = await pdf(pdfPath, { scale: 3 });
  let counter = 1;
  const imagePaths = [];

  for await (const image of document) {
    const imgPath = path.join(outputDir, `page-${counter}.png`);
    await fs.writeFile(imgPath, image);
    imagePaths.push(imgPath);
    counter++;
  }

  return imagePaths;
}


router.post("/run-flow", uploadFiles().single('file'), validateBody([
  { key: 'flow', type: 'string', required: true },
  { key: 'data', type: 'string', required: true }
]), async (req, res) => {
  try {
    console.log(req.file)
    let { flow, data } = req.body;


    flow = flow || '[]';
    data = data || '{}';

    console.log(req.file)

    console.log(req.body)

    try {
      flow = JSON.parse(flow);
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON in flow" });
    }

    try {
      data = JSON.parse(data);
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON in data" });
    }

    data.isPdf = false;

    if (req.file) {
      if (req.file.mimetype === "application/pdf") {
        const imagePaths = await pdfImg(req.file.path);
        data.isPdf = true;
        data.file = imagePaths.map((p) => ({
          path: p,
          mimetype: "image/png",
          originalname: path.basename(p),
        }));

      }
      else {
        data.file = req.file;
      }

    } else {
      data.file = null;
    }

    if (!Array.isArray(flow)) {
      return res.status(400).json({ error: "Flow must be an array of steps" });
    }

    const job = await flowQueue.add("flow-job", { flow, data });
    console.log("Added job:", job.id);

    res.json({ message: "Flow queued successfully", jobId: job.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/schedule", async (req, res) => {
  try {
    const { flow, data } = req.body;
    if (!flow || !data) {
      return res.status(400).json({ error: "Flow and data are required" });
    }

    if (!Array.isArray(flow)) {
      return res.status(400).json({ error: "Flow must be an array of steps" });
    }

    schedule.scheduleJob(data.start, async () => {
      try {
        const job = await flowQueue.add("flow-job", { flow, data });
        console.log("Scheduled job added:", job.id);
      } catch (err) {
        console.error("Error adding scheduled job:", err);
      }
    });

    res.json({ message: "Flow scheduled successfully", startTime: data.start });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;