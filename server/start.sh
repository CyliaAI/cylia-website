#!/bin/sh

echo "Waiting for PostgreSQL..."

# Wait until db is ready
until pg_isready -h db -p 5432 -U root; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Postgres is up - running migrations"

# Apply migrations
npx prisma migrate deploy

# Start the app
npx nodemon dist/index.js