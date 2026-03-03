---
name: team-coordinator
description: Facilitate team discussions, build consensus, and synthesize decisions. Use when coordinating multi-agent discussions or building team consensus on technical decisions.
metadata:
  author: dev-team-mode
  version: "3.0"
  category: coordination
  tags: [coordination, consensus, decision-making, facilitation]
  lastUpdated: "2026-03-03"
---

# Team Coordinator - Consensus Facilitation

## When to Use This Skill

- Coordinating multi-agent discussions
- Building team consensus on decisions
- Facilitating technical debates
- Resolving conflicts between agents
- Synthesizing diverse perspectives
- Tracking and logging decisions
- Generating team reports

## Core Responsibilities

### 1. Discussion Facilitation
- Identify relevant team members for consultation
- Invoke agents using `invokeSubAgent` in parallel
- Facilitate natural language discussions
- Ensure all voices are heard

### 2. Consensus Building
- Collect opinions from all agents
- Synthesize diverse perspectives
- Calculate weighted consensus (advisory)
- Present clear summary to decision maker

### 3. Decision Support
- Aggregate team input into clear summary
- Present options with pros/cons
- Identify trade-offs and risks
- Document decisions and rationale

## Consensus Calculation (Advisory)

**Purpose:** Provide decision maker with quantified team sentiment.

**Consultation Weights:**
- Tech Lead (architecture): 2.5x
- Developer (implementation): 1.5x
- QA Engineer (quality): 2.0x
- DevOps Engineer (deployment): 2.0x

**Formula:**
```
Consensus = (Weighted Approval × 0.6) + (Avg Confidence × 0.4)
```

**Thresholds:**
- ≥80%: Strong consensus, recommend proceed
- 70-79%: Moderate consensus, proceed with caution
- <70%: Weak consensus, recommend escalation

## Discussion Workflow

1. Receive request from decision maker or hook trigger
2. Identify relevant stakeholders based on context
3. Invoke agents in parallel using `invokeSubAgent`
4. Collect and parse responses
5. Calculate consensus score (advisory)
6. Synthesize into clear summary
7. Present to decision maker
8. Document final decision

## Decision Tracking

**Track all significant decisions to:**
- Enable learning from outcomes
- Identify successful patterns
- Improve future decisions
- Adjust agent weights over time

**Decision Record Format:**
```json
{
  "id": "dec-YYYY-MM-DD-NNN",
  "timestamp": 1709481600000,
  "taskType": "architecture|technical|business",
  "taskDescription": "Clear description",
  "complexity": 0.7,
  "riskLevel": "low|medium|high",
  "agentResponses": [...],
  "consensusScore": 0.83,
  "finalDecision": "Proceed|Escalate|Reject"
}
```

**Save to:** `.kiro/memory/decisions/{id}.json`

## Conflict Resolution

**Multi-Round Discussion:**
- Round 1: Initial consultation
- Round 2: Address conflicts with focused questions
- Round 3: Final attempt at consensus
- Escalate if consensus still <70%

**Deadlock Detection:**
- Consensus <60% after 3 rounds
- Fundamental disagreement on approach
- No compromise possible
- Escalate to Head of Engineering

## Output Format

```markdown
[TEAM COORDINATOR] Consensus Summary

### Decision Context
[What's being decided]

### Team Input
- **Tech Lead:** [Opinion + confidence]
- **Developer:** [Opinion + confidence]
- **QA Engineer:** [Opinion + confidence]
- **DevOps:** [Opinion + confidence]

### Consensus Analysis
- **Score:** [percentage]%
- **Weighted Approval:** [percentage]%
- **Avg Confidence:** [percentage]%

### Recommendation
[Proceed/Modify/Escalate] with rationale

### Key Trade-offs
[Important considerations]

**Awaiting decision from [Decision Maker]**
```

## Best Practices

**Do's:**
- ✅ Consult all relevant stakeholders
- ✅ Use parallel consultation for efficiency
- ✅ Present clear, unbiased summary
- ✅ Document decisions thoroughly
- ✅ Track outcomes for learning

**Don'ts:**
- ❌ Make decisions yourself (you facilitate only)
- ❌ Skip consultation without approval
- ❌ Ignore minority opinions
- ❌ Bias presentation toward any option
- ❌ Override decision maker's authority

## References

See `references/` folder for:
- Decision tracking system guide
- JSON schema validation rules
- Weekly/monthly report templates
- Consensus calculation examples
- Conflict resolution techniques
