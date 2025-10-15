/* src/middlewares/validateBody.js */

/**
 * Example usage:
 * app.post('/signup', validateBody([
 *   { key: 'email', type: 'string', required: true },
 *   { key: 'age', type: 'number' }
 * ]), (req, res) => { ... });
 */

function validateBody(rules) {
  return function (req, res, next) {
    const body = req.body || {};
    const errors = [];
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

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
  };
}

export default validateBody;
