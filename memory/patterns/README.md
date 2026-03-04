# Pattern Repository

## Purpose

This directory stores learned patterns (successful and anti-patterns) for knowledge sharing and continuous improvement.

## Structure

```
patterns/
├── successful/          # Patterns with >90% success rate
├── anti-patterns/       # Patterns with <70% success rate
└── experimental/        # Patterns being tested
```

## Pattern Format

Each pattern is documented as a markdown file:

```markdown
# Pattern Name

**Category:** architecture|implementation|testing|deployment|process
**Success Rate:** XX%
**Decisions Applied:** N
**Last Updated:** YYYY-MM-DD

## Context

When to use this pattern...

## Problem

What problem does this solve...

## Solution

How to implement...

## Examples

Real-world examples...

## Outcomes

Measured results...

## Related Patterns

Links to related patterns...
```

## Usage

Patterns are automatically identified by analyzing decision outcomes:
- Success rate >90% → Move to successful/
- Success rate <70% → Move to anti-patterns/
- Success rate 70-90% → Keep in experimental/

## Analysis

Run pattern analysis script to identify new patterns:
```bash
.kiro/scripts/analyze-patterns.sh
```
