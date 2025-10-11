import { uploadFiles } from "../middlewares/uploadFiles.js";
import axios from "axios";

export const summarise = async (model, text) => {
  try {
    const response = await axios.post("http://10.231.221.121:5000/api/summarize", { model_name: model, text }, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data.summary;
  } catch (error) {
    console.error("Error Summarizing Text:", error);
  }
};

export const rag = async (model, text) => {
  try {
    const response = await axios.post("http://10.231.221.121:5000/api/rag", { model_name: model, text }, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data.summary;
  } catch (error) {
    console.error("Error in RAG:", error);
  }
};
