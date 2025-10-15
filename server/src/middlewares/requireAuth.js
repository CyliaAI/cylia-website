/* eslint-env node */
import jwt from 'jsonwebtoken';

const JWT_SECRET = '38';
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment');
}

/**
 * Middleware to require authentication via JWT
 * Usage: app.use(requireAuth)
 */
export async function requireAuth(req, res, next) {
  try {
    // Support Authorization Header "Bearer <token>" or cookie named "token"
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const token =
      tokenFromHeader || (req.cookies && req.cookies.token) || req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    if (!payload?.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Attach user info to request body for downstream handlers
    if (req.body) {
      req.body.user = { id: payload.userId, role: payload.role };
    }

    next();
  } catch (err) {
    next(err);
  }
}
