import { Queue } from "bullmq";

export const flowQueue = new Queue("flow-queue", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
});
    