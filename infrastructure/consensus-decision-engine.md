# Consensus & Decision Engine

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-03-02

---

## Overview

Automated consensus-building and decision-making system for multi-agent coordination without human intervention.

## Consensus Algorithm

### Voting-Based Consensus

```typescript
interface AgentVote {
  agent: AgentRole;
  decision: 'approve' | 'modify' | 'reject';
  confidence: number; // 0-100
  reasoning: string;
  weight: number; // Role-based weight
}

interface ConsensusResult {
  consensus: boolean;
  score: number; // 0-100
  decision: 'auto-proceed' | 'escalate';
  votes: AgentVote[];
  dissenting: AgentRole[];
  reasoning: string;
}
```

### Scoring Formula

```typescript
function calculateConsensus(votes: AgentVote[]): ConsensusResult {
  const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
  const approvalWeight = votes
    .filter(v => v.decision === 'approve')
    .reduce((sum, v) => sum + v.weight, 0);
  const approvalRate = (approvalWeight / totalWeight) * 100;
  
  const avgConfidence = votes.reduce((sum, v) => sum + v.confidence, 0) / votes.length;
  const consensusScore = (approvalRate * 0.6) + (avgConfidence * 0.4);
  
  const consensus = consensusScore >= 80;
  const decision = consensus ? 'auto-proceed' : 'escalate';
  
  return { consensus, score: consensusScore, decision, votes, dissenting: votes.filter(v => v.decision !== 'approve').map(v => v.agent), reasoning: generateReasoning(votes, consensusScore) };
}
```

### Role-Based Weights

```typescript
const ROLE_WEIGHTS = {
  'product-owner': { 'business-decision': 2.0, 'technical-decision': 0.5, 'architecture-decision': 0.5 },
  'tech-lead': { 'business-decision': 0.5, 'technical-decision': 2.0, 'architecture-decision': 2.5 },
  'developer': { 'business-decision': 0.3, 'technical-decision': 1.5, 'architecture-decision': 1.0 },
  'qa-engineer': { 'business-decision': 0.3, 'technical-decision': 1.0, 'architecture-decision': 0.5 },
  'devops-engineer': { 'business-decision': 0.3, 'technical-decision': 1.0, 'architecture-decision': 1.0 }
};
```

## Decision Categories

**Technical Decisions (75%):** Code structure, algorithms, libraries  
**Architecture Decisions (80%):** Design patterns, API contracts, schemas  
**Quality Decisions (85%):** Test strategy, coverage, quality gates  
**Deployment Decisions (80%):** CI/CD, infrastructure, deployment  
**Business Decisions (90%):** Features, breaking changes, timelines

## Conflict Resolution

### Multi-Round Discussion

```typescript
async function resolveConflict(votes: AgentVote[], maxRounds: number = 3): Promise<ConsensusResult> {
  let round = 1;
  let currentVotes = votes;
  
  while (round <= maxRounds) {
    const result = calculateConsensus(currentVotes);
    if (result.consensus) return result;
    
    const compromise = generateCompromise(currentVotes);
    currentVotes = await collectVotes(compromise);
    round++;
  }
  
  return { consensus: false, decision: 'escalate', reasoning: 'Failed to reach consensus after 3 rounds' };
}
```

### Deadlock Detection

```typescript
function detectDeadlock(history: ConsensusResult[]): boolean {
  if (history.length < 3) return false;
  const last3 = history.slice(-3);
  const dissentingSets = last3.map(r => new Set(r.dissenting));
  return dissentingSets.every((set, i) => i === 0 || setsEqual(set, dissentingSets[i - 1]));
}
```

## Escalation Rules

```typescript
const ESCALATION_RULES = [
  { condition: (ctx) => ctx.riskScore > 70, reason: 'High risk decision', escalateTo: 'human' },
  { condition: (ctx) => ctx.consensus.score < 60, reason: 'Low consensus score', escalateTo: 'product-owner' },
  { condition: (ctx) => ctx.impactScore > 80, reason: 'High business impact', escalateTo: 'human' },
  { condition: (ctx) => ctx.breakingChange === true, reason: 'Breaking change detected', escalateTo: 'human' },
  { condition: (ctx) => detectDeadlock(ctx.history), reason: 'Deadlock detected', escalateTo: 'product-owner' }
];
```

## Decision Recording

### Storage Location
```
.kiro/memory/decisions/
├── 2026-03-02-auth-implementation.md
├── 2026-03-02-database-migration.md
└── 2026-03-02-api-versioning.md
```

### Decision Log Template
```markdown
# Decision Log: [ID]
**Date:** 2026-03-02  
**Type:** Architecture  
**Status:** Auto-Approved ✅

## Context
Task, Complexity, Risk, Impact scores

## Participants
Roles with weights

## Voting Results
Each agent's decision, confidence, reasoning

## Consensus Analysis
Approval rate, confidence, score, decision

## Implementation
Assignment, effort, timeline

## Validation
Security, tests, docs, review checklist
```

## Quality Validation

```typescript
function validateDecision(decision: Decision): ValidationResult {
  const violations: string[] = [];
  if (!followsSecurityPolicies(decision)) violations.push('Violates security policies');
  if (decision.testCoverage < 80) violations.push('Test coverage below 80%');
  return { valid: violations.length === 0, violations };
}
```

## Metrics & Monitoring

**Key Metrics:**
- Total decisions, auto-approved, escalated
- Avg consensus score, decision time
- Consensus rate, escalation rate, deadlock rate

**Alerting:**
- Consensus rate < 80% → Alert
- Escalation rate > 20% → Alert
- Deadlock rate > 5% → Alert

## Learning System

```typescript
function learnFromOutcome(pattern: DecisionPattern): void {
  if (pattern.outcome === 'success') {
    adjustWeights(pattern.context, +0.05);
  } else {
    adjustWeights(pattern.context, -0.1);
    addEscalationRule(pattern.context);
  }
}
```

---

**Implementation Status:** Design Complete ✅  
**Next Steps:** Implement voting system and decision recording
