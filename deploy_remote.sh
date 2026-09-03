#!/usr/bin/env bash
# ==============================================================================
# FixIT Village — 1-Command Remote Deployment to 187.127.153.41
# Domain: games.adityagagare.in
# ==============================================================================

set -e

SERVER_IP="187.127.153.41"
SERVER_USER="${DEPLOY_USER:-root}"
REMOTE_PATH="/var/www/games.adityagagare.in"

echo "================================================================"
echo "🚀 Deploying FixIT Village to $SERVER_USER@$SERVER_IP"
echo "   Target Directory: $REMOTE_PATH"
echo "   Domain: https://games.adityagagare.in"
echo "================================================================"

# 1. Local Pre-flight Verification & Client Production Build
echo "🧪 [1/4] Running local verification tests..."
npm test

echo "🛠️ [2/4] Compiling client production bundle locally..."
npm run build

echo "📦 [3/4] Syncing project files and dist to remote server..."
ssh "$SERVER_USER@$SERVER_IP" "mkdir -p $REMOTE_PATH"

rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'client/node_modules' \
  --exclude 'server/node_modules' \
  --exclude 'server/archives' \
  ./ "$SERVER_USER@$SERVER_IP:$REMOTE_PATH"

echo "⚙️ [4/4] Updating server dependencies and restarting PM2 on remote server..."
ssh "$SERVER_USER@$SERVER_IP" "bash -s" << 'EOF'
  set -e
  cd /var/www/games.adityagagare.in
  chmod +x deploy.sh setup_nginx_ssl.sh

  # Install server runtime dependencies
  cd server && npm install --omit=dev --prefer-offline --no-audit
  cd ..

  # Check & start PM2
  if command -v pm2 >/dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
    pm2 save
  else
    npm install -g pm2
    pm2 start ecosystem.config.cjs
    pm2 save
    pm2 startup || true
  fi
EOF

echo ""
echo "================================================================"
echo "🎉 DEPLOYMENT COMPLETE! Visit: https://games.adityagagare.in"
echo "================================================================"
