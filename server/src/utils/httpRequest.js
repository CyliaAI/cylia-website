import { Request, Response } from "express";
import axios from "axios";

async function handleHttp(req, res) {
  const { apiUrl, payload } = req.body;
  try {
    const response = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    res.json(response.data);
  } 
  catch (err) {
      res.status(500).json({msg:"Error"});
  }
}

export default handleHttp;
