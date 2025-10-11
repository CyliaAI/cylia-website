import express from "express";
import { flowQueue } from "../workers/flowQueue.js";

const router = express.Router();

router.post("/run-flow", async (req, res) => {
  try {

    console.log(req.body)

    const { flow, data } = req.body;

    console.log("Flow:", flow);
    console.log("Data:", data);

    if (!Array.isArray(flow)) {
      return res.status(400).json({ error: "Flow must be an array of steps" });
    }

    let countsBefore = await flowQueue.getJobCounts();
    console.log("Counts before:", countsBefore);

    // BullMQ requires a job name as the first argument
    const job = await flowQueue.add("flow-job", { flow, data });
    console.log("Added job:", job.id);

    let countsAfter = await flowQueue.getJobCounts();
    console.log("Counts after:", countsAfter);

    res.json({ message: "Flow queued successfully", jobId: job.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
