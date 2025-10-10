import { Request, Response } from "express";
import axios from "axios";

async function handleHttp(req: Request, res: Response) {
  const inpdata = req.body;
  try {
    const response = await axios.post("APIURL", inpdata,{
      headers: { "Content-Type": "application/json" },
    });
    res.json(response.data);
  } 
  catch (err: unknown) {
      res.status(500).json({msg:"Error"});
  }
}

export default handleHttp;
