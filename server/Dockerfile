# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .


RUN npx prisma generate

# Compile TypeScript
RUN npm run build

FROM node:22-alpine

WORKDIR /app

# Copy only compiled JS and package.json (runtime dependencies)
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env .env

RUN npx prisma generate

# Expose your app port
EXPOSE 8000

CMD ["npx", "nodemon", "dist/index.js"]
