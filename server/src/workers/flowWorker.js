import { Worker } from "bullmq";
import { flowQueue } from "../workers/flowQueue.js"; // BullMQ Queue instance
import { sendMail } from "../utils/sendMail.js";
import { extractTextFromFile } from "../utils/ocr.js";
import { uploadFiles } from "../middlewares/uploadFiles.js";
import { summarise, rag } from "../utils/ml.js";

// Define Tasks which are asynchronous
const uploadPDF = async (ctx) => {
  // No Functionality as of now
  return ctx;
};

const ocr = async (ctx) => {
  await extractTextFromFile(ctx.file).then((text) => {
    ctx.content = text;
  });
  return ctx;
};

const summarize = async (ctx) => {
  const summary = await summarise(ctx.model, ctx.content);
  ctx.content = summary;
  return ctx;
};

const ragFn = async (ctx) => {
  const retrieved_text = await rag(ctx.model, ctx.content);
  ctx.content = retrieved_text;
  return ctx;
}

const sendEmail = async (ctx) => {
    await sendMail(ctx.email, "Automated Email from Cylia", ctx.content)
    return ctx;
}
// Map of Task Names
const taskMap = {
  uploadPDF,
  ocr,
  ragFn,
  summarize,
  sendEmail,
};

// --- Create a worker ---
const worker = new Worker(
  flowQueue.name, // Queue Name
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
    concurrency: 5
  }
);

// --- Listen to events ---
worker.on("completed", (job) => console.log(`Job ${job.id} fully completed`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} failed:`, err));
