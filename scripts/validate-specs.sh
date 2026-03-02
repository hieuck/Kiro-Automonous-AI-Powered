#!/bin/bash
# Validate spec files for required sections and format

set -e

SPECS_DIR=".kiro/specs"
TEMPLATES_DIR=".kiro/templates"
ERRORS=0

echo "🔍 Validating spec files..."

# Check if specs directory exists
if [ ! -d "$SPECS_DIR" ]; then
  echo "❌ Specs directory not found: $SPECS_DIR"
  exit 1
fi

# Validate each spec file
for spec_file in "$SPECS_DIR"/*.md; do
  if [ ! -f "$spec_file" ]; then
    echo "⚠️  No spec files found in $SPECS_DIR"
    exit 0
  fi
  
  filename=$(basename "$spec_file")
  echo "  Checking: $filename"
  
  # Check required metadata fields
  if ! grep -q "^**Type:**" "$spec_file"; then
    echo "    ❌ Missing required field: Type"
    ERRORS=$((ERRORS + 1))
  fi
  
  if ! grep -q "^**Priority:**" "$spec_file"; then
    echo "    ❌ Missing required field: Priority"
    ERRORS=$((ERRORS + 1))
  fi
  
  if ! grep -q "^**Status:**" "$spec_file"; then
    echo "    ❌ Missing required field: Status"
    ERRORS=$((ERRORS + 1))
  fi
  
  # Check for main sections
  if ! grep -q "^## .*Overview" "$spec_file"; then
    echo "    ⚠️  Missing recommended section: Overview"
  fi
  
  if ! grep -q "^## .*Goals" "$spec_file"; then
    echo "    ⚠️  Missing recommended section: Goals"
  fi
  
  # Type-specific validation
  type=$(grep "^**Type:**" "$spec_file" | sed 's/**Type:** *//')
  
  if [[ "$type" == *"Feature"* ]]; then
    if ! grep -q "User Stories" "$spec_file" && ! grep -q "User Story" "$spec_file"; then
      echo "    ⚠️  Feature spec missing User Stories section"
    fi
    
    if ! grep -q "Acceptance Criteria" "$spec_file"; then
      echo "    ⚠️  Feature spec missing Acceptance Criteria"
    fi
  fi
  
  if [[ "$type" == *"Bug"* ]]; then
    if ! grep -q "Reproduction Steps" "$spec_file" && ! grep -q "Steps to Reproduce" "$spec_file"; then
      echo "    ⚠️  Bug spec missing Reproduction Steps"
    fi
    
    if ! grep -q "Root Cause" "$spec_file"; then
      echo "    ⚠️  Bug spec missing Root Cause Analysis"
    fi
  fi
  
  if [[ "$type" == *"Refactor"* ]]; then
    if ! grep -q "Current Problems" "$spec_file" && ! grep -q "Problems" "$spec_file"; then
      echo "    ⚠️  Refactoring spec missing Current Problems section"
    fi
    
    if ! grep -q "Proposed Solution" "$spec_file" && ! grep -q "Solution" "$spec_file"; then
      echo "    ⚠️  Refactoring spec missing Proposed Solution"
    fi
  fi
  
  # Check for testing section
  if ! grep -q "Testing" "$spec_file" && ! grep -q "Test" "$spec_file"; then
    echo "    ⚠️  Missing Testing section"
  fi
  
  if [ $ERRORS -eq 0 ]; then
    echo "    ✅ Valid"
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo ""
  echo "✅ All specs validated successfully!"
  exit 0
else
  echo ""
  echo "❌ Found $ERRORS error(s) in spec files"
  exit 1
fi
