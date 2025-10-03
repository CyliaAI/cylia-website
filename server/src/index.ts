import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

// Cross Origin Resource Sharing
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
