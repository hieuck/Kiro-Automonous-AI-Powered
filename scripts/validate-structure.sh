#!/bin/bash
# Validate .kiro directory structure

set -e

echo "🔍 Validating .kiro directory structure..."

ERRORS=0

# Required directories
required_dirs=(
  ".kiro"
  ".kiro/agents"
  ".kiro/hooks"
  ".kiro/skills"
  ".kiro/steering"
  ".kiro/memory"
  ".kiro/memory/metrics"
  ".kiro/memory/sessions"
  ".kiro/specs"
  ".kiro/templates"
  ".kiro/scripts"
)

for dir in "${required_dirs[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "  ❌ Missing required directory: $dir"
    ERRORS=$((ERRORS + 1))
  else
    echo "  ✅ $dir"
  fi
done

# Required files
required_files=(
  ".kiro/README.md"
  ".kiro/CHANGELOG.md"
  ".kiro/ROADMAP.md"
  ".kiro/agents/dev-team-mode.json"
)

echo ""
echo "Checking required files..."

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "  ❌ Missing required file: $file"
    ERRORS=$((ERRORS + 1))
  else
    echo "  ✅ $file"
  fi
done

# Check for at least one file in key directories
echo ""
echo "Checking directory contents..."

if [ -z "$(ls -A .kiro/hooks/*.kiro.hook 2>/dev/null)" ]; then
  echo "  ⚠️  No hook files found in .kiro/hooks/"
fi

if [ -z "$(ls -A .kiro/skills/*.md 2>/dev/null)" ]; then
  echo "  ⚠️  No skill files found in .kiro/skills/"
fi

if [ -z "$(ls -A .kiro/steering/*.md 2>/dev/null)" ]; then
  echo "  ⚠️  No steering files found in .kiro/steering/"
fi

if [ -z "$(ls -A .kiro/templates/*.md 2>/dev/null)" ]; then
  echo "  ⚠️  No template files found in .kiro/templates/"
fi

echo ""

if [ $ERRORS -eq 0 ]; then
  echo "✅ Directory structure validated successfully!"
  exit 0
else
  echo "❌ Found $ERRORS error(s) in directory structure"
  exit 1
fi
