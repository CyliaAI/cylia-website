import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import validateBody from '../middlewares/validateBody.js';

const prisma = new PrismaClient();

const router = Router();

router.post(
  '/find',
  validateBody([{ key: 'search', type: 'string', required: true }]),
  async (req, res) => {
    try {
      const { search } = req.body;
      const users = await prisma.user.findMany({
        where: {
          email: {
            startsWith: search,
            mode: 'insensitive',
          },
        },
        take: 10,
      });
      return res.status(200).json({ users });
    } catch (err) {
      console.error('Server Error: ', err);
      return res.status(500).json({ error: 'Could not Fetch Users' });
    }
  },
);

export default router;
