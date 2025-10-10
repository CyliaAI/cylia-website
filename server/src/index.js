import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploads.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.get("/", (req, res) => {
  res.send(`
    <h2 style="text-align:center">Welcome to the Transfinitte-25 Backend Server</h2>
  `);
});

app.use("/upload", uploadRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
