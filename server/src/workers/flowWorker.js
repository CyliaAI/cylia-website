import { Worker } from 'bullmq';
import { flowQueue } from '../workers/flowQueue.js';
import { sendMail } from '../utils/sendMail.js';
import { extractTextFromFile } from '../utils/ocr.js';
import { uploadFiles } from '../middlewares/uploadFiles.js';
import { summarise, rag, toVectorDB } from '../utils/ml.js';
import schedule from 'node-schedule';

const Document = async (ctx) => {
  return ctx;
};

const FiletoText = async (ctx) => {
  if (ctx.isPdf) {
    for (let i = 0; i < ctx.file.length; i++) {
      await extractTextFromFile(ctx.file[i]).then((text) => {
        ctx.content += text;
      });
    }
  } else {
    await extractTextFromFile(ctx.file).then((text) => {
      ctx.content = text;
    });
  }
  return ctx;
};

const summarize = async (ctx) => {
  const summary = await summarise(ctx.model, ctx.content);
  ctx.content = summary;
  return ctx;
};

const ToVectorDB = async (ctx) => {
  const success = await toVectorDB(ctx.userId, ctx.content);
  return ctx;
};

const RAG = async (ctx) => {
  const retrieved_text = await rag(ctx.userId, ctx['RAG'][0]);
  ctx.content = retrieved_text;
  return ctx;
};

const SendEmail = async (ctx) => {
  const email = ctx['SendEmail'][ctx['SendEmail'].length - 1][0];
  const subject = ctx['SendEmail'][ctx['SendEmail'].length - 1][1];
  await sendMail(email, subject, ctx.content);
  return ctx;
};

const Start = async (ctx) => {
  return ctx;
};

const Output = async (ctx) => {
  return ctx;
};

const Schedule = async (ctx) => {
  const currentIndex = ctx.flow.indexOf('Schedule');
  const remainingFlow = ctx.flow.slice(currentIndex + 1);

  const newCtx = { ...ctx };
  newCtx.flow = remainingFlow;
  newCtx.content = '';
  ctx.skip = true;

  schedule.scheduleJob(newCtx.start, async () => {
    await flowQueue.add('flow-job', {
      flow: remainingFlow,
      data: newCtx,
    });
  });

  return ctx;
};

const LLM = async (ctx) => {
  const summary = await summarise(ctx.model, ctx.content);
  if (summary) ctx.content = summary;
  return ctx;
};

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

const worker = new Worker(
  flowQueue.name,
  async (job) => {
    const { flow, data } = job.data;
    let context = { ...data, flow: [...flow] };

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
  },
);

worker.on('completed', (job) => {});
worker.on('failed', (job, err) => console.error(`Job ${job.id} failed:`, err));
