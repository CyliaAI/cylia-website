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
  if (ctx.isPdf) {
    console.log(ctx.file)
    for (let i = 0; i < ctx.file.length; i++) {
      await extractTextFromFile(ctx.file[i]).then((text) => {
        ctx.content += text;
      });
    }
  }
  else {
    await extractTextFromFile(ctx.file).then((text) => {
      ctx.content = text;
    });
  }

  console.log("Content")
  console.log(ctx.content)

  return ctx;
};

const summarize = async (ctx) => {
  console.log("in summary")
  const summary = await summarise(ctx.model, ctx.content);
  ctx.content = summary;
  console.log(ctx.content)
  return ctx;
};

const RAG = async (ctx) => {
  const retrieved_text = await rag(ctx.model, ctx.content);
  ctx.content = retrieved_text;
  return ctx;
}

const SendEmail = async (ctx) => {
  console.log("in send mail")
  console.log(ctx['SendEmail'][ctx['SendEmail'].length - 1])
  const email = ctx['SendEmail'][ctx['SendEmail'].length - 1][0]
  const subject = ctx['SendEmail'][ctx['SendEmail'].length - 1][1]
  await sendMail(email, "Automated Email from Cylia", ctx.content)
  return ctx;
}

const Start = async (ctx) => {
  console.log("Started")
  return ctx
}

const Output = async (ctx) => {
  console.log("Output");
  return ctx
}

const Schedule = async (ctx) => {
  console.log("Scheduled");
  return ctx
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
