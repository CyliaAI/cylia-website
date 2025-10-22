import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import flowRoute from './routes/flow.js';
import workspaceRoutes from './routes/workspaces.js';
import userRoutes from './routes/users.js';
import customRoutes from './routes/customNode.js';
import chatbotRoutes from './routes/chatbot.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;
app.use(
  cors({
    origin: 'https://cylia.vercel.app',
    credentials: true,
  }),
);
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send(`
    <h2 style="text-align:center">Welcome to the Transfinitte-25 Backend Server</h2>
  `);
});

app.use('/auth', authRoutes);
app.use('/task', flowRoute);
app.use('/workspaces', workspaceRoutes);
app.use('/customNode', customRoutes);
app.use('/users', userRoutes);
app.use('/chatbot', chatbotRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
