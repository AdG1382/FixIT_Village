#!/usr/bin/env bash
# ==============================================================================
# Setup Nginx Reverse Proxy & SSL Certificate for games.adityagagare.in
# Target Server: 187.127.153.41
# ==============================================================================

set -e

DOMAIN="games.adityagagare.in"
CONF_SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/nginx/games.adityagagare.in.conf"
CONF_DEST="/etc/nginx/sites-available/$DOMAIN"
CONF_ENABLED="/etc/nginx/sites-enabled/$DOMAIN"

echo "================================================================"
echo "🔧 Setting up Nginx Reverse Proxy for: $DOMAIN"
echo "================================================================"

if [ "$EUID" -ne 0 ]; then
  echo "⚠️ Please run this script as root or with sudo:"
  echo "   sudo ./setup_nginx_ssl.sh"
  exit 1
fi

# 1. Ensure Nginx is installed
if ! command -v nginx >/dev/null 2>&1; then
  echo "📦 Installing Nginx..."
  apt-get update && apt-get install -y nginx
fi

# 2. Copy Nginx configuration file
echo "📋 Copying Nginx configuration to $CONF_DEST..."
cp "$CONF_SOURCE" "$CONF_DEST"

# 3. Enable site
if [ ! -f "$CONF_ENABLED" ]; then
  echo "🔗 Enabling Nginx site configuration..."
  ln -s "$CONF_DEST" "$CONF_ENABLED"
fi

# 4. Test Nginx configuration
echo "🧪 Testing Nginx configuration syntax..."
nginx -t

# 5. Reload Nginx
echo "🔄 Reloading Nginx..."
systemctl reload nginx

echo "✅ Nginx is now proxying HTTP traffic for $DOMAIN to port 3001!"

# 6. SSL Certificate via Certbot
echo ""
echo "🔒 Checking Certbot for Free HTTPS / SSL Certificate..."
if ! command -v certbot >/dev/null 2>&1; then
  echo "📦 Installing Certbot & Nginx plugin..."
  apt-get update && apt-get install -y certbot python3-certbot-nginx
fi

echo "🔐 Requesting Let's Encrypt SSL Certificate for $DOMAIN..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --redirect -m "admin@adityagagare.in" || {
  echo "⚠️ Automated Certbot prompt failed or email needed. Running interactive Certbot:"
  certbot --nginx -d "$DOMAIN"
}

echo ""
echo "================================================================"
echo "🎉 SUCCESS: https://$DOMAIN is LIVE with SSL & WebSockets!"
echo "================================================================"
