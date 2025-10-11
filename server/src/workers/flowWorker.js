// flowWorkerMQ.js
import { Worker } from "bullmq";
import { flowQueue } from "../workers/flowQueue.js"; // your BullMQ Queue instance
import { sendMail } from "../utils/sendMail.js";

// --- Define your tasks ---
// Make all tasks async for consistency
const uploadPDF = async (ctx) => {
  console.log("upload");
  await new Promise((r) => setTimeout(r, 200)); // simulate async work
  return ctx;
};

const ocr = async (ctx) => {
  console.log("ocr");
  await new Promise((r) => setTimeout(r, 200));
  return ctx;
};

const summarize = async (ctx) => {
  console.log("summ");
  await new Promise((r) => setTimeout(r, 200));
  return ctx;
};

const sendEmail = async (ctx) => {
    console.log("in send mail")
    await sendMail(ctx.email, "nigga", "chigga")
    return ctx;
}
// Map of task names → functions
const taskMap = {
  uploadPDF,
  ocr,
  summarize,
  sendEmail,
};

// --- Create a worker ---
const worker = new Worker(
  flowQueue.name, // the name of your queue
  async (job) => {
    console.log("Processing job:", job.id);

    const { flow, data } = job.data;
    let context = { ...data };

    for (const step of flow) {
      const fn = taskMap[step];
      if (!fn) throw new Error(`Unknown task: ${step}`);

      console.log(`Running step: ${step}`);
      context = await fn(context);
    }

    console.log(`Job ${job.id} completed`);
    return context;
  },
  {
    connection: flowQueue.opts.connection, // reuse your Redis connection from queue
  }
);

// --- Listen to events ---
worker.on("completed", (job) => console.log(`Job ${job.id} fully completed`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} failed:`, err));

console.log("Worker ready and listening for jobs...");
