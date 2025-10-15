import axios from 'axios';
import { Console } from 'console';
import 'dotenv/config';

export const summarise = async (model, text) => {
  try {
    const response = await axios.post(
      `${process.env.ML_SERVER}/api/summarize`,
      { model_name: model, text },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return response.data.summary;
  } catch (error) {
    console.error('Error Summarizing Text:', error);
  }
};

export const toVectorDB = async (userId, text) => {
  try {
    const response = await axios.post(
      `${process.env.ML_SERVER}/api/add-docs`,
      { userId, text },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return response.data.success;
  } catch (error) {
    console.error('Error in Adding Documents:', error);
  }
};

export const rag = async (userId, query) => {
  try {
    const response = await axios.post(
      `${process.env.ML_SERVER}/api/query`,
      { userId, query, model_name: 'llama3.2:1b' },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return response.data.result;
  } catch (error) {
    console.error('Error in RAG:', error);
  }
};

export const chatbot = async (model, text) => {
  try {
    const response = await axios.post(
      `${process.env.ML_SERVER}/api/chatbot`,
      { model_name: model, text },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data.reply;
  } catch (error) {
    console.error('Error Summarizing Text:', error);
  }
};
