#!/usr/bin/env bash
# ==============================================================================
# FixIT Village — Automated Production Deployment Script
# ==============================================================================

set -e

echo "🚀 [1/5] Pulling latest changes from git..."
git pull origin main || echo "⚠️ Skipping git pull (not a git repo or local push)"

echo "📦 [2/5] Installing server & client dependencies..."
cd client && npm install --prefer-offline --no-audit
cd ../server && npm install --prefer-offline --no-audit
cd ..

echo "🛠️ [3/5] Building client production bundle..."
npm run build

echo "🧪 [4/5] Running deterministic engine tests..."
npm run test

echo "🔄 [5/5] Reloading PM2 process..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
  pm2 save
  echo "✅ FixIT Village successfully deployed and running on PM2!"
else
  echo "⚠️ PM2 not found globally. You can start the server with: npm start"
fi
