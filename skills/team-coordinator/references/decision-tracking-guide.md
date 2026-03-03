# Decision Tracking System Guide

## Overview

Track all significant team decisions to enable learning, pattern recognition, and continuous improvement.

## Decision Record Structure

### File Location
`.kiro/memory/decisions/{id}.json`

### ID Format
`dec-YYYY-MM-DD-NNN`

Example: `dec-2026-03-03-001`

### Complete Schema

```json
{
  "id": "dec-2026-03-03-001",
  "timestamp": 1709481600000,
  "taskType": "architecture|technical|business",
  "taskDescription": "Clear description of what's being decided",
  "taskContext": "Additional context and background",
  "complexity": 0.7,
  "riskLevel": "low|medium|high",
  
  "agentResponses": [
    {
      "agent": "tech-lead-agent",
      "decision": "Approve|Reject|Modify",
      "confidence": 90,
      "rationale": "Detailed reasoning",
      "timestamp": 1709481610000,
      "responseTime": 10000
    }
  ],
  
  "consensusScore": 0.83,
  "weightedApproval": 0.85,
  "avgConfidence": 83.3,
  "finalDecision": "Proceed|Escalate|Reject",
  "escalated": false,
  "escalatedTo": "head-of-engineering|external",
  
  "decisionMaker": "tech-lead-agent",
  "decisionRationale": "Why this decision was made",
  
  "outcome": {
    "success": true,
    "executionTime": 172800000,
    "qualityScore": 0.9,
    "issuesFound": 2,
    "testsPass": true,
    "performanceImpact": 0.3,
    "actualResult": "What actually happened",
    "lessonsLearned": ["Lesson 1", "Lesson 2"],
    "completedAt": 1709654400000
  },
  
  "version": "1.0",
  "environment": "development|staging|production",
  "tags": ["architecture", "api-gateway", "serverless"]
}
```

## Complexity Scoring Guide

| Score | Description | Examples |
|-------|-------------|----------|
| 0.1-0.3 | Simple | Bug fix, documentation update, minor refactor |
| 0.4-0.6 | Moderate | New feature, API endpoint, database migration |
| 0.7-0.8 | Complex | Architecture change, major refactor, new service |
| 0.9-1.0 | Critical | Breaking change, security fix, data migration |

## Risk Level Assessment

**Low:**
- No production impact
- Easily reversible
- Well-understood approach
- Low user impact

**Medium:**
- Some production impact
- Rollback possible but complex
- Moderate uncertainty
- Affects subset of users

**High:**
- Significant production impact
- Difficult to rollback
- High uncertainty
- Security or data concerns
- Affects all users

## Confidence Extraction

Parse agent responses for confidence indicators:

**90-100% (Very High):**
- "Strongly approve"
- "Definitely"
- "Highly confident"
- "This is the right approach"

**75-89% (High):**
- "Approve"
- "Yes"
- "Good approach"
- "Recommend"

**60-74% (Moderate):**
- "Approve with concerns"
- "Probably"
- "Should work"
- "With some reservations"

**40-59% (Low):**
- "Uncertain"
- "Maybe"
- "Not sure"
- "Needs more analysis"

**0-39% (Very Low):**
- "Reject"
- "No"
- "Don't recommend"
- "Too risky"

## Outcome Tracking

### Quality Score Calculation

```
Quality Score = 
  (Tests Pass ? 0.3 : 0) +
  (Issues < 3 ? 0.2 : Issues < 5 ? 0.1 : 0) +
  (Performance Improved ? 0.2 : Same ? 0.15 : 0.1) +
  (Success ? 0.3 : 0)

Range: 0.0 - 1.0
```

### Performance Impact

```
Performance Impact = (New Time - Old Time) / Old Time

Positive: Improvement (faster)
Zero: No change
Negative: Degradation (slower)
```

### When to Track Outcome

- Within 1 week of task completion
- After all tests run
- After deployment (if applicable)
- After monitoring period (24-48 hours)

## Index Management

### Index File Location
`.kiro/memory/decisions/index.json`

### Index Structure

```json
{
  "lastUpdated": 1709481600000,
  "totalDecisions": 15,
  "decisionsByType": {
    "architecture": 5,
    "technical": 8,
    "business": 2
  },
  "decisionsByAgent": {
    "tech-lead-agent": 15,
    "developer-agent": 12,
    "qa-engineer-agent": 10
  },
  "recentDecisions": [
    "dec-2026-03-03-001",
    "dec-2026-03-02-003"
  ]
}
```

### Update Index After Every Decision

1. Increment totalDecisions
2. Update decisionsByType
3. Update decisionsByAgent
4. Add to recentDecisions (keep last 20)
5. Update lastUpdated timestamp

## Agent Weight Management

### Weight File Location
`.kiro/memory/agent-weights.json`

### Weight Structure

```json
{
  "lastUpdated": 1709481600000,
  "weights": {
    "tech-lead-agent": 2.6,
    "developer-agent": 1.4,
    "qa-engineer-agent": 2.5,
    "devops-engineer-agent": 2.0,
    "product-owner-agent": 1.8
  },
  "baseWeights": {
    "tech-lead-agent": 2.5,
    "developer-agent": 1.5,
    "qa-engineer-agent": 2.5,
    "devops-engineer-agent": 2.0,
    "product-owner-agent": 1.8
  },
  "history": [
    {
      "timestamp": 1709481600000,
      "agent": "tech-lead-agent",
      "oldWeight": 2.5,
      "newWeight": 2.6,
      "reason": "High accuracy (95%) in architecture decisions",
      "accuracy": 0.95,
      "sampleSize": 20
    }
  ]
}
```

### Weekly Weight Update Process

**Every Monday (automated):**

1. **Calculate Agent Accuracy:**
   ```
   For each agent:
     - Get last 20 decisions with outcomes
     - Count successful decisions (success=true, qualityScore>0.8)
     - Accuracy = Successful / Total
   ```

2. **Calculate Team Average:**
   ```
   Team Avg = Sum(all agent accuracies) / Number of agents
   ```

3. **Adjust Weights:**
   ```
   Accuracy Bonus = (Agent Accuracy - Team Avg) × 0.5
   New Weight = Base Weight × (1 + Accuracy Bonus)
   Clamp: 0.5× to 2.0× base weight
   ```

4. **Save and Log:**
   - Update weights in agent-weights.json
   - Add entry to history array
   - Log reason for change

## Best Practices

### Decision Tracking
- Track all decisions requiring team consensus
- Be consistent with format
- Extract accurate confidence levels
- Record detailed rationales

### Outcome Tracking
- Follow up within 1 week
- Be honest about failures
- Document lessons learned
- Update promptly

### Weight Updates
- Update weekly on schedule
- Document reasons for changes
- Notify team of significant changes
- Keep history for transparency

### Data Quality
- Validate all JSON against schemas
- Ensure timestamps are accurate
- Keep descriptions clear and concise
- Tag decisions appropriately
