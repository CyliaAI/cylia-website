import { Worker } from "bullmq";
import { flowQueue } from "../workers/flowQueue.js"; // BullMQ Queue instance
import { sendMail } from "../utils/sendMail.js";
import { extractTextFromFile } from "../utils/ocr.js";
import { uploadFiles } from "../middlewares/uploadFiles.js";
import { summarise, rag, toVectorDB } from "../utils/ml.js";
import schedule from 'node-schedule'

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

  console.log("Content : ", ctx.content)
  return ctx;
};

const summarize = async (ctx) => {
  console.log("in Summary");
  const summary = await summarise(ctx.model, ctx.content);
  ctx.content = summary;
  console.log(ctx.content)
  return ctx;
};

const ToVectorDB = async (ctx) => {
  const success = await toVectorDB(ctx.userId, ctx.model, ctx.content);
  console.log(success)
  return ctx;
};

const RAG = async (ctx) => {
  const retrieved_text = await rag(ctx.userId, ctx.model, ctx.content);
  ctx.content = retrieved_text;
  return ctx;
}

const SendEmail = async (ctx) => {
  console.log("Mail")
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
  console.log("Scheduled at:", ctx.start);

  const currentIndex = ctx.flow.indexOf("Schedule");

  // Take everything after Schedule
  const remainingFlow = ctx.flow.slice(currentIndex + 1);

  // Make a fresh context for the next run
  const newCtx = { ...ctx };
  newCtx.flow = remainingFlow;
  newCtx.content = '';
  ctx.skip = true;

  schedule.scheduleJob(newCtx.start, async () => {
    console.log(`Resuming scheduled flow from ${newCtx.start}...`);
    console.log(newCtx)
    await flowQueue.add("flow-job", {
      flow: remainingFlow,
      data: newCtx
    });
  });

  console.log(`Workflow paused. Will resume at ${newCtx.start}.`);
  return ctx;
};



const LLM = async (ctx) => {
  console.log("_________________________")
  console.log(ctx.content)
  console.log("_________________________")
  const summary = await summarise(ctx.model, ctx.content);
  if (summary) ctx.content = summary;
  console.log("*************************")
  console.log(ctx.content)
  console.log("*************************")
  return ctx;
}
// Map of Task Names
const taskMap = {
  Document,
  FiletoText,
  ToVectorDB,
  RAG,
  LLM,
  Schedule,
  SendEmail,
  Start,
  Output,
};

// --- Create a worker ---
const worker = new Worker(
  flowQueue.name,
  async (job) => {
    const { flow, data } = job.data;
    let context = { ...data, flow: [...flow] }; // clone flow into context


    for (const step of flow.slice()) {
      if (context.skip) break;
      const fn = taskMap[step];
      if (!fn) throw new Error(`Unknown task: ${step}`);
      context = await fn(context);
      context.flow.shift();
    }

    return context;
  },
  {
    connection: flowQueue.opts.connection,
    concurrency: 5,
  }
);
// --- Listen to events ---
worker.on("completed", (job) => console.log(`Job ${job.id} fully completed`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} failed:`, err));
