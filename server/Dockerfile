# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Compile TypeScript
RUN npm run build

FROM node:22-alpine

WORKDIR /app

# Copy only compiled JS and package.json (runtime dependencies)
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

COPY .env .env

# Expose your app port
EXPOSE 8000

CMD ["node", "dist/index.js"]
