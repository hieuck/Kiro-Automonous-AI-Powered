# Feature Prioritization Frameworks

## RICE Scoring

**Formula:** `RICE = (Reach × Impact × Confidence) / Effort`

### Reach
How many users will this affect per time period?
- 1000+ users/month = 1000
- 100-999 users/month = 500
- 10-99 users/month = 50
- <10 users/month = 10

### Impact
How much will this impact each user?
- Massive = 3
- High = 2
- Medium = 1
- Low = 0.5
- Minimal = 0.25

### Confidence
How confident are we in our estimates?
- High = 100%
- Medium = 80%
- Low = 50%

### Effort
How much work is required?
- Person-months (0.5, 1, 2, 4, etc.)

### Example

```
Feature: User authentication
Reach: 1000 users/month
Impact: 3 (Massive - security critical)
Confidence: 100% (High - clear requirements)
Effort: 2 person-months

RICE = (1000 × 3 × 1.0) / 2 = 1500
```

## MoSCoW Method

### Must Have
- Critical for release
- Non-negotiable
- Legal/compliance requirements
- Core functionality

### Should Have
- Important but not critical
- Significant value
- Can be deferred if needed

### Could Have
- Nice to have
- Adds value but not essential
- Include if time permits

### Won't Have
- Out of scope for this release
- Low priority
- Future consideration

## Value vs Effort Matrix

```
High Value, Low Effort  → Quick Wins (Do First)
High Value, High Effort → Major Projects (Plan Carefully)
Low Value, Low Effort   → Fill-ins (Do if time)
Low Value, High Effort  → Time Sinks (Avoid)
```

## Kano Model

### Basic Needs
- Expected by users
- Dissatisfaction if missing
- No extra satisfaction if present

### Performance Needs
- More is better
- Linear satisfaction
- Competitive differentiators

### Excitement Needs
- Unexpected delights
- High satisfaction if present
- No dissatisfaction if missing

## Weighted Scoring

```
Score = (Business Value × 0.4) + 
        (User Impact × 0.3) + 
        (Strategic Fit × 0.2) + 
        (Risk × 0.1)
```

## Best Practices

- Use data to inform decisions
- Involve stakeholders
- Review priorities regularly
- Balance short-term and long-term
- Consider technical debt
- Validate assumptions with users
