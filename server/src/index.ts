import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Transfinitte-25 Backend Server</h1>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
