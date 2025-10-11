import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import uploadRoute from "./routes/fileUpload.js";
import authRoutes from './routes/auth.js'

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send(`
    <h2 style="text-align:center">Welcome to the Transfinitte-25 Backend Server</h2>
  `);
});

app.use('/auth',authRoutes)
app.use("/upload", uploadRoute);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
