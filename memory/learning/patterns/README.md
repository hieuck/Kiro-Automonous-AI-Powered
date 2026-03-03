# Learning Patterns

This directory stores identified patterns from team decisions and outcomes.

## Pattern Types

### Success Patterns
Decisions that consistently lead to good outcomes:
- High quality scores (>0.9)
- Fast execution
- No issues found
- Positive performance impact

### Anti-Patterns
Decisions that consistently lead to problems:
- Low quality scores (<0.7)
- Many issues found
- Performance degradation
- Frequent rework needed

## Pattern Structure

```json
{
  "id": "pattern-001",
  "type": "success|anti-pattern",
  "name": "Pattern name",
  "description": "What this pattern is",
  "occurrences": 15,
  "successRate": 0.93,
  "avgQualityScore": 0.91,
  "examples": ["dec-2026-03-03-001", "dec-2026-03-05-002"],
  "recommendations": "How to apply or avoid this pattern"
}
```

## Usage

Patterns are automatically identified by:
- Monthly organizational review
- Pattern recognition algorithms
- Team learning system

Agents reference these patterns when making decisions.
