#!/bin/bash
# Script to run migrations before starting the app in production

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting Next.js application..."
npm start
