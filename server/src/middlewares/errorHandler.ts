/* src/middlewares/errorHandler.ts */
import type { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handler. Use `next({ status: 400, message: '...' })`
 * or throw errors — for non-object errors we fallback to 500.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // If headers already sent, delegate to default
  if (res.headersSent) return next(err);

  console.error('Unhandled error:', err);

  // If thrown object has status/message, use them
  if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
    return res.status(err.status as number).json({ message: err.message });
  }

  // If it's an instance of Error with message
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }

  // Fallback
  console.error('Server Error: ', err);
  return res.status(500).json({ error: 'Internal server error' });
}
