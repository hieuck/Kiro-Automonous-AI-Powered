---
inclusion: always
---

# Consensus Algorithm Enhancements

**Version:** 1.0.0  
**Last Updated:** March 5, 2026  
**Status:** ✅ Active

---

## Overview

This document defines enhancements to the consensus algorithm to handle edge cases, urgency levels, and improve decision quality.

---

## Enhanced Consensus Calculation

### Base Formula

```typescript
Consensus = (Weighted Approval × 0.6) + (Avg Confidence × 0.4)

Where:
- Weighted Approval = Sum of (agent weight × approval) / Total weight
- Avg Confidence = Average of all agent confidence levels
```

### Edge Case Handling

#### 1. Abstentions

**Problem:** What if an agent abstains or says "don't know"?

**Solution:**
```typescript
// Exclude abstentions from calculation
const activeResponses = responses.filter(r => r.decision !== 'Abstain');
const weightedApproval = calculateWeightedApproval(activeResponses);
const avgConfidence = calculateAvgConfidence(activeResponses);
```

**Example:**
```
Tech Lead: Approve (90% confidence, weight 2.5)
QA Lead: Abstain (weight 2.5) ← Excluded
Developer: Approve (80% confidence, weight 1.5)

Weighted Approval = (2.5 + 1.5) / (2.5 + 1.5) = 100%
Avg Confidence = (90 + 80) / 2 = 85%
Consensus = (1.0 × 0.6) + (0.85 × 0.4) = 94%
```

#### 2. Tie Breaking

**Problem:** What if weighted approval is exactly 50%?

**Solution:**
```typescript
if (weightedApproval === 0.5) {
  // Defer to highest-weighted agent
  const highestWeightAgent = getHighestWeightAgent(responses);
  return highestWeightAgent.decision;
}
```

**Tie-Breaking Priority:**
1. Tech Lead (2.5x) - Architecture decisions
2. QA Lead (2.5x) - Quality decisions
3. DevOps Lead (2.0x) - Infrastructure decisions
4. Product Owner (2.0x) - Business decisions
5. Developer (1.5x) - Implementation decisions

#### 3. High Confidence Variance

**Problem:** What if agents have vastly different confidence levels?

**Solution:**
```typescript
const confidenceVariance = calculateVariance(confidences);

if (confidenceVariance > 30) {
  // Flag for review
  return {
    consensus,
    warning: 'High confidence variance detected',
    recommendation: 'Consider additional consultation'
  };
}
```

**Example:**
```
Tech Lead: Approve (95% confidence)
QA Lead: Approve (90% confidence)
Developer: Approve (40% confidence) ← Low confidence

Variance = 30% → Flag for review
```

---

## Urgency-Based Thresholds

### Urgency Levels

**P0 (Critical):**
- Production down
- Data loss risk
- Security breach
- Critical bug affecting users

**P1 (High):**
- Major feature broken
- Performance degraded >50%
- High error rate

**P2 (Medium):**
- Minor feature broken
- Performance degraded <50%
- Elevated error rate

**P3 (Low):**
- Cosmetic issues
- Minor performance issues
- Nice-to-have improvements

### Adjusted Thresholds

| Urgency | Consensus Threshold | Review Time | Escalation |
|---------|-------------------|-------------|------------|
| P0 | 70% | <15 min | Immediate |
| P1 | 80% | <30 min | If <70% |
| P2 | 80% | <1 hour | If <70% |
| P3 | 85% | <4 hours | If <80% |

### Implementation

```typescript
function getConsensusThreshold(urgency: string): number {
  switch (urgency) {
    case 'P0': return 0.70; // Lower threshold for critical
    case 'P1': return 0.80; // Standard threshold
    case 'P2': return 0.80; // Standard threshold
    case 'P3': return 0.85; // Higher threshold for low priority
    default: return 0.80;
  }
}

function shouldProceed(consensus: number, urgency: string): boolean {
  const threshold = getConsensusThreshold(urgency);
  return consensus >= threshold;
}
```

### Example: P0 Critical Issue

```
Issue: Production database down
Urgency: P0
Threshold: 70% (lowered from 80%)

Tech Lead: Approve (85% confidence) - "Rollback to last known good"
QA Lead: Modify (70% confidence) - "Need to verify backup first"
DevOps: Approve (90% confidence) - "Rollback is safe"

Weighted Approval = (2.5 + 2.0) / (2.5 + 2.5 + 2.0) = 64%
Avg Confidence = (85 + 70 + 90) / 3 = 82%
Consensus = (0.64 × 0.6) + (0.82 × 0.4) = 71%

Result: 71% ≥ 70% → PROCEED (due to P0 urgency)
```

---

## Fast-Track Criteria

### When to Fast-Track

**Criteria:**
1. Low complexity (<3/10)
2. Low risk
3. High confidence (>90%)
4. Unanimous approval
5. Similar pattern succeeded before

### Fast-Track Process

```typescript
function canFastTrack(decision: Decision): boolean {
  return (
    decision.complexity < 3 &&
    decision.risk === 'low' &&
    decision.avgConfidence > 0.90 &&
    decision.unanimousApproval &&
    decision.similarPatternSucceeded
  );
}

if (canFastTrack(decision)) {
  // Skip full consensus process
  // Proceed immediately
  // Log as fast-tracked
}
```

### Example: Simple Bug Fix

```
Task: Fix typo in error message
Complexity: 1/10
Risk: low
Pattern: Similar fixes succeeded 100% (10/10)

Tech Lead: Approve (95% confidence)
QA Lead: Approve (95% confidence)
Developer: Approve (95% confidence)

Result: Fast-track → Proceed immediately
```

---

## Confidence Calibration

### Problem

Agents may be overconfident or underconfident. Need to calibrate confidence to match actual outcomes.

### Solution

Track confidence vs. outcome:

```typescript
interface ConfidenceCalibration {
  agent: string;
  predictedConfidence: number;
  actualSuccess: boolean;
  calibrationError: number;
}

// Calculate calibration error
function calculateCalibrationError(
  predictions: ConfidenceCalibration[]
): number {
  const errors = predictions.map(p => {
    const expected = p.predictedConfidence / 100;
    const actual = p.actualSuccess ? 1 : 0;
    return Math.abs(expected - actual);
  });
  
  return errors.reduce((a, b) => a + b, 0) / errors.length;
}
```

### Calibration Adjustment

```typescript
function adjustConfidence(
  rawConfidence: number,
  calibrationError: number
): number {
  // If agent is overconfident (error high), reduce confidence
  // If agent is underconfident (error low), increase confidence
  
  if (calibrationError > 0.2) {
    // Overconfident - reduce
    return rawConfidence * 0.9;
  } else if (calibrationError < 0.1) {
    // Well-calibrated - no change
    return rawConfidence;
  } else {
    // Slightly overconfident - minor reduction
    return rawConfidence * 0.95;
  }
}
```

### Example

```
Tech Lead predictions (last 20 decisions):
- Predicted 90% confidence → 18/20 succeeded (90%) ✓ Well-calibrated
- Calibration error: 0.05 (low)
- No adjustment needed

Developer predictions (last 20 decisions):
- Predicted 80% confidence → 12/20 succeeded (60%) ✗ Overconfident
- Calibration error: 0.20 (high)
- Adjust: 80% → 72% (reduce by 10%)
```

---

## Emergency Decision Process

### When to Use

- P0 critical issues
- Production down
- Data loss imminent
- Security breach active

### Process

```
1. Detect emergency (automatic or manual)
   ↓
2. Notify all agents immediately
   ↓
3. Parallel consultation (5 minute timeout)
   ↓
4. Lower consensus threshold (70%)
   ↓
5. If no consensus in 5 min → HOE decides
   ↓
6. Execute decision immediately
   ↓
7. Monitor closely
   ↓
8. Post-mortem after resolution
```

### Example: Production Database Down

```
Time 0:00 - Emergency detected
Time 0:01 - All agents notified
Time 0:02 - Agents respond:
  - Tech Lead: Rollback (85% confidence)
  - QA Lead: Verify backup first (70% confidence)
  - DevOps: Rollback safe (90% confidence)
Time 0:03 - Consensus: 71% ≥ 70% → PROCEED
Time 0:04 - Execute rollback
Time 0:10 - Database restored ✓
Time 0:15 - Post-mortem scheduled
```

---

## Consensus Quality Metrics

### Track

1. **Consensus Accuracy**
   - Did high consensus lead to success?
   - Did low consensus lead to failure?

2. **Consensus Speed**
   - How long to reach consensus?
   - Bottlenecks?

3. **Consensus Stability**
   - Do agents change opinions?
   - How often?

4. **Consensus Diversity**
   - Are all agents contributing?
   - Or dominated by one?

### Target Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Consensus Accuracy | >90% | TBD | 📊 Measuring |
| Consensus Speed | <2 min | TBD | 📊 Measuring |
| Consensus Stability | >85% | TBD | 📊 Measuring |
| Consensus Diversity | 0.6-0.8 | TBD | 📊 Measuring |

---

## Summary

**Enhanced consensus algorithm handles:**
- ✅ Abstentions (exclude from calculation)
- ✅ Tie breaking (defer to highest-weighted agent)
- ✅ Confidence variance (flag if >30%)
- ✅ Urgency levels (adjust thresholds)
- ✅ Fast-track (skip for simple tasks)
- ✅ Confidence calibration (adjust for accuracy)
- ✅ Emergency process (5 min timeout, 70% threshold)

**Result: More robust, flexible, and accurate consensus decisions.**

---

**Version:** 1.0.0  
**Last Updated:** March 5, 2026  
**Next Review:** March 12, 2026
