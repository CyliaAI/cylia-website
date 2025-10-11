import { chatbot, summarise } from "../utils/ml.js";
import { Router } from "express";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const { model, text } = req.body;
    if (!model || !text) {
      return res.status(400).json({ error: "Model and text are required" });
    }

    console.log(model, text);

    const result = await chatbot(model, text);
    res.json({ result });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;