import { Queue } from "bullmq"

export const flowQueue = new Queue("flow-queue", {
  connection: {
    url: process.env.REDIS_URL
  }
})
