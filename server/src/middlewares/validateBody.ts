/* src/middlewares/validateBody.ts */
import type { Request, Response, NextFunction } from 'express';

type Rule = {
  key: string;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
};

/**
 * validateBody([{ key: 'email', type:'string', required:true }, ...])
 */
export function validateBody(rules: Rule[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body ?? {};
    const errors: string[] = [];

    for (const rule of rules) {
      const val = body[rule.key];

      if (rule.required && (val === undefined || val === null || val === '')) {
        errors.push(`${rule.key} is required`);
        continue;
      }

      if (val !== undefined && rule.type) {
        const actualType = Array.isArray(val) ? 'array' : typeof val;
        if (actualType !== rule.type) {
          errors.push(`${rule.key} must be ${rule.type} (got ${actualType})`);
        }
      }
    }

    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    next();
  };
}
