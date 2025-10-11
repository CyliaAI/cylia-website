import { Worker } from "bullmq";
import { flowQueue } from "../workers/flowQueue.js"; // BullMQ Queue instance
import { sendMail } from "../utils/sendMail.js";
import { extractTextFromFile } from "../utils/ocr.js";
import { uploadFiles } from "../middlewares/uploadFiles.js";
import { summarise, rag } from "../utils/ml.js";

// Define Tasks which are asynchronous
const Document = async (ctx) => {
  // No Functionality as of now
  return ctx;
};

const FiletoText = async (ctx) => {
  console.log(ctx)
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

const RAG = async (ctx) => {
const RAG = async (ctx) => {
  const retrieved_text = await rag(ctx.model, ctx.content);
  ctx.content = retrieved_text;
  return ctx;
}

const SendEmail = async (ctx) => {
    await sendMail(ctx.email, "Automated Email from Cylia", ctx.content)
    return ctx;
}

const Start = async (ctx) => {
  console.log("Started")
}

const Output = async (ctx) => {
  console.log("Output");
}

const Schedule = async (ctx) => {
  console.log("Scheduled");
} 

const LLM = async (ctx) => {
  const summary = await summarise(ctx.model, ctx.content);
  ctx.content = summary;
  return ctx;
}
// Map of Task Names
const taskMap = {
  Document,
  FiletoText,
  RAG,
  LLM,
  SendEmail,
  Start,
  Output,
};

// --- Create a worker ---
const worker = new Worker(
  flowQueue.name,
  async (job) => {
    console.log("Processing job:", job.id);

    const { flow, data } = job.data;
    let context = { ...data };
    console.log(context)
    for (const step of flow) {
      const fn = taskMap[step];
      if (!fn) throw new Error(`Unknown task: ${step}`);

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
