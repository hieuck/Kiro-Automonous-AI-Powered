#!/bin/bash
# Validate all hook files for correct JSON syntax and schema

set -e

HOOKS_DIR=".kiro/hooks"
ERRORS=0

echo "🔍 Validating hook files..."

# Check if hooks directory exists
if [ ! -d "$HOOKS_DIR" ]; then
  echo "❌ Hooks directory not found: $HOOKS_DIR"
  exit 1
fi

# Validate each hook file
for hook_file in "$HOOKS_DIR"/*.kiro.hook; do
  if [ ! -f "$hook_file" ]; then
    continue
  fi
  
  filename=$(basename "$hook_file")
  echo "  Checking: $filename"
  
  # Check JSON syntax
  if ! jq empty "$hook_file" 2>/dev/null; then
    echo "    ❌ Invalid JSON syntax"
    ERRORS=$((ERRORS + 1))
    continue
  fi
  
  # Check required fields
  name=$(jq -r '.name // empty' "$hook_file")
  version=$(jq -r '.version // empty' "$hook_file")
  when_type=$(jq -r '.when.type // empty' "$hook_file")
  then_type=$(jq -r '.then.type // empty' "$hook_file")
  
  if [ -z "$name" ]; then
    echo "    ❌ Missing required field: name"
    ERRORS=$((ERRORS + 1))
  fi
  
  if [ -z "$version" ]; then
    echo "    ❌ Missing required field: version"
    ERRORS=$((ERRORS + 1))
  fi
  
  if [ -z "$when_type" ]; then
    echo "    ❌ Missing required field: when.type"
    ERRORS=$((ERRORS + 1))
  fi
  
  if [ -z "$then_type" ]; then
    echo "    ❌ Missing required field: then.type"
    ERRORS=$((ERRORS + 1))
  fi
  
  # Validate when.type values
  valid_when_types="fileEdited fileCreated fileDeleted userTriggered promptSubmit agentStop preToolUse postToolUse preTaskExecution postTaskExecution"
  if [ -n "$when_type" ] && ! echo "$valid_when_types" | grep -qw "$when_type"; then
    echo "    ❌ Invalid when.type: $when_type"
    ERRORS=$((ERRORS + 1))
  fi
  
  # Validate then.type values
  if [ -n "$then_type" ] && [ "$then_type" != "askAgent" ] && [ "$then_type" != "runCommand" ]; then
    echo "    ❌ Invalid then.type: $then_type (must be askAgent or runCommand)"
    ERRORS=$((ERRORS + 1))
  fi
  
  # Check file patterns for file-based hooks
  if [[ "$when_type" =~ ^(fileEdited|fileCreated|fileDeleted)$ ]]; then
    patterns=$(jq -r '.when.patterns // empty' "$hook_file")
    if [ -z "$patterns" ] || [ "$patterns" = "null" ]; then
      echo "    ❌ File-based hook missing when.patterns"
      ERRORS=$((ERRORS + 1))
    fi
  fi
  
  # Check toolTypes for tool-based hooks
  if [[ "$when_type" =~ ^(preToolUse|postToolUse)$ ]]; then
    tool_types=$(jq -r '.when.toolTypes // empty' "$hook_file")
    if [ -z "$tool_types" ] || [ "$tool_types" = "null" ]; then
      echo "    ❌ Tool-based hook missing when.toolTypes"
      ERRORS=$((ERRORS + 1))
    fi
  fi
  
  # Check prompt for askAgent
  if [ "$then_type" = "askAgent" ]; then
    prompt=$(jq -r '.then.prompt // empty' "$hook_file")
    if [ -z "$prompt" ]; then
      echo "    ❌ askAgent hook missing then.prompt"
      ERRORS=$((ERRORS + 1))
    fi
  fi
  
  # Check command for runCommand
  if [ "$then_type" = "runCommand" ]; then
    command=$(jq -r '.then.command // empty' "$hook_file")
    if [ -z "$command" ]; then
      echo "    ❌ runCommand hook missing then.command"
      ERRORS=$((ERRORS + 1))
    fi
  fi
  
  if [ $ERRORS -eq 0 ]; then
    echo "    ✅ Valid"
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo ""
  echo "✅ All hooks validated successfully!"
  exit 0
else
  echo ""
  echo "❌ Found $ERRORS error(s) in hook files"
  exit 1
fi
