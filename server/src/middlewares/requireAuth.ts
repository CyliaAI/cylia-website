import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/jwtPayload.ts';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment');
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Support Authorization Header "Bearer <token>" or cookie named "token"
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const token =
      tokenFromHeader ??
      (req.cookies && (req.cookies.token as string)) ??
      req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token ' });
    }

    if (!payload?.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    if (req.body) req.body.user = { id: payload.userId, role: payload.role };

    next();
  } catch (err) {
    next(err);
  }
}
