#!/bin/bash

# Pattern Analysis Script
# Analyzes decision outcomes to identify successful patterns and anti-patterns
# Uses Python script for cross-platform compatibility

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if Python is available
if command -v python3 &> /dev/null; then
  python3 "$SCRIPT_DIR/analyze-patterns.py"
elif command -v python &> /dev/null; then
  python "$SCRIPT_DIR/analyze-patterns.py"
else
  echo "❌ Error: Python not found"
  echo "Please install Python 3 to use this script"
  exit 1
fi
