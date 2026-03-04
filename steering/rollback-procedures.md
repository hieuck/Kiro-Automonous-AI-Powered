---
inclusion: always
---

# Rollback Procedures

**Version:** 1.0.0  
**Last Updated:** March 5, 2026  
**Status:** ✅ Active

---

## Overview

This document defines procedures for rolling back changes when self-evolution leads to undesired outcomes.

---

## Rollback Triggers

### Automatic Rollback Triggers

**Quality Degradation:**
- Quality score drops below 6.0 (from baseline ≥7.0)
- Test coverage drops below 75% (from baseline ≥80%)
- Decision accuracy drops below 75% (from baseline ≥85%)

**Performance Degradation:**
- Cycle time increases >50% (e.g., 24h → 36h)
- Decision time increases >100% (e.g., 2min → 4min)
- Response time increases >50%

**Security Issues:**
- Security scan failures increase >20%
- New critical vulnerabilities introduced
- Authentication/authorization failures

### Manual Rollback Triggers

**User Request:**
- User explicitly requests rollback
- User identifies undesired behavior
- User overrides AI decision

**HOE Decision:**
- Strategic misalignment detected
- Process change causing issues
- Team consensus on rollback needed

---

## Rollback Scope

### Code Rollback

**What Gets Rolled Back:**
- Source code changes
- Configuration files
- Database migrations (if safe)

**How to Rollback:**
```bash
# Rollback last commit
git revert HEAD

# Rollback specific commit
git revert <commit-hash>

# Rollback multiple commits
git revert HEAD~3..HEAD

# Rollback to specific point
git reset --hard <commit-hash>
```

**Safety Checks:**
- Verify no data loss
- Check dependencies
- Run all tests
- Verify deployment

### Process Rollback

**What Gets Rolled Back:**
- Decision framework changes
- Consensus algorithm modifications
- Quality threshold adjustments
- Workflow changes

**How to Rollback:**
1. Identify process change in `.kiro/memory/decisions/`
2. Restore previous version from Git history
3. Update documentation
4. Notify team of rollback
5. Log rollback decision

### Weight Rollback

**What Gets Rolled Back:**
- Agent weight adjustments
- Weight calculation algorithm changes

**How to Rollback:**
```bash
# Restore previous weights
cp .kiro/memory/agent-weights.json.backup .kiro/memory/agent-weights.json

# Or manually edit weights
# Set weights back to base values
```

**Process:**
1. Load previous weights from backup or history
2. Update `.kiro/memory/agent-weights.json`
3. Clear adjustment history for rolled-back period
4. Document rollback reason
5. Monitor next 10 decisions

### Infrastructure Rollback

**What Gets Rolled Back:**
- Hooks (.kiro/hooks/)
- Scripts (.kiro/scripts/)
- Steering files (.kiro/steering/)
- Settings (.kiro/settings/)

**How to Rollback:**
```bash
# Rollback specific file
git checkout HEAD~1 .kiro/hooks/quality-gate.kiro.hook

# Rollback entire directory
git checkout HEAD~1 .kiro/hooks/

# Restore from backup
cp -r .kiro.backup/ .kiro/
```

---

## Rollback Process

### Step 1: Detect Issue

**Automated Detection:**
- Monitoring system detects degradation
- Quality gate failures increase
- Metrics fall below thresholds
- Alerts triggered

**Manual Detection:**
- User reports issue
- Team member identifies problem
- Code review catches issue

### Step 2: Assess Impact

**Questions to Answer:**
- What changed recently?
- When did the issue start?
- What is the scope of impact?
- Is it getting worse?
- Can we fix forward or must rollback?

**Decision Matrix:**

| Impact | Severity | Action |
|--------|----------|--------|
| Low | Minor | Fix forward |
| Medium | Moderate | Evaluate: fix vs. rollback |
| High | Major | Rollback immediately |
| Critical | Severe | Emergency rollback + escalate |

### Step 3: Execute Rollback

**For Code Changes:**
```bash
# 1. Identify problematic commit
git log --oneline -10

# 2. Revert commit
git revert <commit-hash>

# 3. Run tests
npm test

# 4. Verify quality
npm run lint
npm run test:coverage

# 5. Commit rollback
git commit -m "revert: rollback <feature> due to <reason>"

# 6. Deploy if needed
```

**For Process Changes:**
```bash
# 1. Identify changed files
git diff HEAD~5 .kiro/

# 2. Restore previous version
git checkout HEAD~5 .kiro/steering/decision-framework.md

# 3. Verify restoration
git diff

# 4. Commit rollback
git commit -m "revert: restore previous decision framework"

# 5. Notify team
```

**For Weight Changes:**
```bash
# 1. Backup current weights
cp .kiro/memory/agent-weights.json .kiro/memory/agent-weights.json.backup

# 2. Restore previous weights
git checkout HEAD~1 .kiro/memory/agent-weights.json

# 3. Verify restoration
cat .kiro/memory/agent-weights.json

# 4. Commit rollback
git commit -m "revert: restore previous agent weights"

# 5. Monitor next decisions
```

### Step 4: Verify Rollback

**Verification Checklist:**
- [ ] All tests pass
- [ ] Quality score restored (≥7.0)
- [ ] Coverage restored (≥80%)
- [ ] Performance metrics restored
- [ ] No new issues introduced
- [ ] Team notified
- [ ] Documentation updated

### Step 5: Root Cause Analysis

**Questions to Answer:**
- What caused the issue?
- Why wasn't it caught earlier?
- What can we learn?
- How to prevent recurrence?

**Document Findings:**
```markdown
# Rollback Post-Mortem

**Date:** YYYY-MM-DD
**Rolled Back:** [What was rolled back]
**Reason:** [Why rollback was needed]

## Timeline
- [Time]: Change implemented
- [Time]: Issue detected
- [Time]: Rollback executed
- [Time]: Verification complete

## Root Cause
[What caused the issue]

## Impact
[What was affected]

## Lessons Learned
1. [Lesson 1]
2. [Lesson 2]

## Prevention Measures
1. [Measure 1]
2. [Measure 2]

## Action Items
- [ ] [Action 1]
- [ ] [Action 2]
```

### Step 6: Implement Prevention

**Update Processes:**
- Add quality checks to prevent similar issues
- Improve monitoring to detect earlier
- Update documentation with learnings
- Share knowledge with team

**Update Automation:**
- Add automated checks
- Improve rollback automation
- Enhance monitoring alerts
- Update quality gates

---

## Rollback Automation

### Automatic Rollback Conditions

**When to Auto-Rollback:**
- Quality score <6.0 for 3 consecutive checks
- Test coverage <75% after deployment
- Critical security vulnerability introduced
- Production deployment fails

**Auto-Rollback Script:**
```bash
#!/bin/bash
# .kiro/scripts/auto-rollback.sh

QUALITY_THRESHOLD=6.0
COVERAGE_THRESHOLD=75

# Check quality score
QUALITY_SCORE=$(npm run quality-check | grep "Score:" | awk '{print $2}')

if (( $(echo "$QUALITY_SCORE < $QUALITY_THRESHOLD" | bc -l) )); then
  echo "⚠️  Quality score below threshold: $QUALITY_SCORE < $QUALITY_THRESHOLD"
  echo "Initiating automatic rollback..."
  
  # Rollback last commit
  git revert HEAD --no-edit
  
  # Run tests
  npm test
  
  # Notify team
  echo "✅ Automatic rollback complete"
  echo "📧 Notifying team..."
  
  exit 0
fi

echo "✅ Quality checks passed"
```

---

## Rollback Best Practices

### Do:
- ✅ Rollback quickly when issues detected
- ✅ Document rollback reason
- ✅ Verify rollback success
- ✅ Conduct root cause analysis
- ✅ Learn from rollbacks
- ✅ Update prevention measures

### Don't:
- ❌ Delay rollback hoping issue resolves
- ❌ Rollback without verification
- ❌ Skip root cause analysis
- ❌ Repeat same mistakes
- ❌ Rollback without documentation
- ❌ Ignore lessons learned

---

## Rollback Metrics

**Track:**
- Number of rollbacks per month
- Time to detect issue
- Time to execute rollback
- Rollback success rate
- Recurrence rate

**Target:**
- Rollbacks per month: <2
- Time to detect: <1 hour
- Time to rollback: <30 minutes
- Rollback success rate: >95%
- Recurrence rate: <10%

---

## Emergency Rollback

### Critical Situations

**Immediate Rollback Required:**
- Production down
- Data loss risk
- Security breach
- Critical bug affecting users

**Emergency Process:**
```
1. STOP all deployments immediately
   ↓
2. Assess impact (P0 critical)
   ↓
3. Execute rollback (no approval needed)
   ↓
4. Verify production restored
   ↓
5. Escalate to HOE + User immediately
   ↓
6. Conduct emergency post-mortem
   ↓
7. Implement immediate fixes
```

**Emergency Contacts:**
- HOE (AI): Immediate notification
- User: Immediate notification
- Team: Immediate notification

---

## Rollback Log

**Location:** `.kiro/memory/rollbacks/`

**Format:**
```json
{
  "id": "rollback-YYYY-MM-DD-NNN",
  "timestamp": "ISO 8601",
  "trigger": "automatic|manual|emergency",
  "reason": "Description",
  "scope": "code|process|weights|infrastructure",
  "rollbackTarget": "What was rolled back",
  "executedBy": "agent|user",
  "verificationStatus": "success|failed",
  "impact": "Description of impact",
  "rootCause": "Root cause analysis",
  "preventionMeasures": ["measure1", "measure2"]
}
```

---

## Summary

**Rollback is a safety mechanism, not a failure.**

- ✅ Rollback quickly when needed
- ✅ Learn from every rollback
- ✅ Improve prevention measures
- ✅ Document and share learnings
- ✅ Automate where possible

**The goal is not zero rollbacks, but continuous improvement through learning.**

---

**Version:** 1.0.0  
**Last Updated:** March 5, 2026  
**Next Review:** March 12, 2026
