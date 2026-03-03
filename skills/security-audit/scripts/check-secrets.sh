#!/bin/bash
# Check for secrets in codebase
set -e

FOUND_SECRETS=0

echo "🔍 Scanning for secrets..."

# Case-insensitive search for common secret patterns
if grep -ri "API_KEY\|PASSWORD\|SECRET\|TOKEN\|PRIVATE_KEY" \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=dist \
  --exclude-dir=build \
  --exclude="*.log" \
  .; then
  echo "❌ Secrets found in code!"
  FOUND_SECRETS=1
else
  echo "✅ No secrets found in code"
fi

# Check git history for secrets (last 100 commits only)
echo ""
echo "🔍 Checking git history (last 100 commits)..."
if git log -p -n 100 | grep -i "password\|secret\|api_key" | head -20; then
  echo "❌ Secrets found in git history!"
  FOUND_SECRETS=1
else
  echo "✅ No secrets in recent git history"
fi

echo ""
echo "⚠️  Remember to check .env files manually!"

exit $FOUND_SECRETS
