#!/bin/bash
# ============================================================
# Jason Martin Consulting — Deploy to Cloudflare Pages
# ============================================================
# Place this script inside the "consultant-site" folder and run:
#
#   chmod +x deploy.sh
#   ./deploy.sh
# ============================================================

set -e

PROJECT_NAME="jascmartin"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "=========================================="
echo "  Jason Martin Consulting — Deploy"
echo "=========================================="
echo ""

# Check for Node/npm
if ! command -v npx &> /dev/null; then
  echo "Error: Node.js / npx not found."
  echo "Install Node.js from https://nodejs.org and try again."
  exit 1
fi

echo "→ Project folder: $DIR"
echo "→ Cloudflare Pages project name: $PROJECT_NAME"
echo ""

# First-time login (opens browser)
echo "→ Checking Cloudflare login..."
npx --yes wrangler whoami 2>/dev/null || {
  echo ""
  echo "You need to log in to Cloudflare (browser will open)..."
  npx --yes wrangler login
}

echo ""
echo "→ Deploying to Cloudflare Pages..."
echo "  (This may take 30–60 seconds)"
echo ""

npx --yes wrangler pages deploy "$DIR" \
  --project-name="$PROJECT_NAME" \
  --commit-dirty=true

echo ""
echo "=========================================="
echo "  Deploy complete!"
echo "=========================================="
echo ""
echo "Your site is live at:"
echo "  https://$PROJECT_NAME.pages.dev"
echo ""
echo "Next step — connect your custom domain:"
echo "  1. Go to https://dash.cloudflare.com"
echo "  2. Workers & Pages → $PROJECT_NAME → Custom domains"
echo "  3. Add jascmartin.com"
echo ""
echo "Support Portal is in demo mode."
echo "When your Work API is ready, update js/main.js and re-run this script."
echo ""
