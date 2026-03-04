#!/bin/bash

# Agent Weight Update Script
# Updates agent weights based on decision accuracy
# Uses Python script for cross-platform compatibility

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if Python is available
if command -v python3 &> /dev/null; then
  python3 "$SCRIPT_DIR/update-agent-weights.py"
elif command -v python &> /dev/null; then
  python "$SCRIPT_DIR/update-agent-weights.py"
else
  echo "❌ Error: Python not found"
  echo "Please install Python 3 to use this script"
  exit 1
fi
