import { uploadFiles } from "../middlewares/uploadFiles.js";
import axios from "axios";
import 'dotenv/config'

export const summarise = async (model, text) => {
  try {
    const response = await axios.post(`${process.env.ML_SERVER}/api/summarise`, { model_name: model, text }, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.summary;
  } catch (error) {
    console.error("Error Summarizing Text:", error);
  }
};

export const rag = async (model, text) => {
  try {
    const response = await axios.post(`${process.env.ML_SERVER}/api/rag`, { model_name: model, text }, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data.summary;
  } catch (error) {
    console.error("Error in RAG:", error);
  }
};