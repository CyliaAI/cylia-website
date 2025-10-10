// eslint.config.cjs
module.exports = {
  root: true,
  env: {
    node: true,       // Node.js global variables
    es2021: true,     // Modern JS features
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module", // Enable ESM import/export
  },
  extends: [
    "eslint:recommended", // Recommended ESLint rules
  ],
  rules: {
    // Custom rules
    "no-unused-vars": ["warn"],     // Warn for unused vars
    "no-undef": ["error"],          // Error for undefined vars
    "semi": ["error", "always"],    // Enforce semicolons
    "quotes": ["error", "double"],  // Enforce double quotes
    "no-console": "off",            // Allow console.log
  },
};
