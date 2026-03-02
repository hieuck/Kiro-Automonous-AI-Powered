# CI/CD Integration Guide

**Version:** 1.0.0  
**Date:** 2026-03-02

## Quick Start

Dev Team Mode includes validation scripts for CI/CD integration:

```bash
# Run all validations
bash .kiro/scripts/validate-all.sh
```

## GitHub Actions

Create `.github/workflows/dev-team-validation.yml`:

```yaml
name: Dev Team Validation

on:
  push:
    paths: ['.kiro/**']
  pull_request:
    paths: ['.kiro/**']

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate
        run: bash .kiro/scripts/validate-all.sh
      - name: Check Hook Count
        run: |
          count=$(find .kiro/hooks -name "*.kiro.hook" | wc -l)
          if [ $count -gt 20 ]; then
            echo "Too many hooks: $count"
            exit 1
          fi
```

## Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
if git diff --cached --name-only | grep -q "^\.kiro/"; then
  cd .kiro && bash scripts/validate-all.sh || exit 1
fi
```

## Quality Gates

- Hook count ≤ 20
- No duplicate hooks
- Valid JSON in all configs
- Required documentation present

---

**See full guide in repository for advanced configurations.**
