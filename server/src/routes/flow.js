import express from "express";
import { flowQueue } from "../workers/flowQueue.js";
import schedule from 'node-schedule';
import { uploadFiles } from "../middlewares/uploadFiles.js";

const router = express.Router();

router.post("/run-flow", uploadFiles(1).single('file'), async (req, res) => {
  try {
    let { flow, data } = req.body;

    flow, data = JSON.parse(flow), JSON.parse(data);
    data.file = req.file;
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