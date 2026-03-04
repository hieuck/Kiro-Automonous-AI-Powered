---
inclusion: always
---

# Failure Scenarios & Recovery

**Version:** 1.0.0  
**Last Updated:** March 5, 2026  
**Status:** ✅ Active

---

## Overview

This document provides examples of failure scenarios and how to recover from them. Learning from failures is essential for continuous improvement.

---

## Failure Scenario 1: AI Evolves Process But Makes It Worse

### What Happened

**Context:**
- AI team observed consensus calculation taking 5 minutes
- Decided to optimize by reducing agent consultation
- Changed from parallel to sequential consultation
- Expected: Faster decisions
- Actual: Slower decisions (8 minutes) + lower quality

**Timeline:**
- Day 1: Implemented optimization
- Day 2: Decision time increased to 8 minutes
- Day 3: Quality score dropped from 8.5 to 7.2
- Day 4: Detected degradation, initiated rollback

### Why It Failed

**Root Cause:**
- Misidentified bottleneck (wasn't parallel invocation)
- Actual bottleneck was network latency
- Sequential consultation added more latency
- Lost benefit of parallel processing

**Warning Signs Missed:**
- No A/B testing before full rollout
- No baseline measurement of actual bottleneck
- Assumed cause without data validation

### How to Detect

**Automatic Detection:**
- Metrics monitoring detected:
  - Decision time increased >50% (5min → 8min)
  - Quality score dropped <7.5 (from 8.5)
  - Consensus rate decreased

**Manual Detection:**
- Team noticed slower responses
- Quality degradation visible in outcomes

### How to Recover

**Step 1: Immediate Rollback**
```bash
# Restore previous decision framework
git checkout HEAD~1 .kiro/steering/decision-framework.md

# Verify restoration
git diff

# Commit rollback
git commit -m "revert: restore parallel agent consultation"
```

**Step 2: Verify Recovery**
- Decision time: 8min → 5min ✓
- Quality score: 7.2 → 8.5 ✓
- Consensus rate: restored ✓

**Step 3: Root Cause Analysis**
- Measured actual bottleneck: Network latency
- Identified real solution: Connection pooling
- Documented lesson learned

**Step 4: Implement Correct Fix**
- Added connection pooling
- Kept parallel consultation
- Result: Decision time 5min → 2min ✓

### Lessons Learned

1. **Always measure before optimizing**
   - Don't assume bottleneck
   - Use profiling tools
   - Validate with data

2. **Test changes incrementally**
   - A/B test new approaches
   - Measure impact before full rollout
   - Keep rollback plan ready

3. **Monitor key metrics**
   - Decision time
   - Quality score
   - Consensus rate

4. **Document assumptions**
   - What we thought would happen
   - What actually happened
   - Why the difference

### Prevention Measures

**Added to Process:**
- ✅ Require baseline measurement before optimization
- ✅ Mandate A/B testing for process changes
- ✅ Add rollback plan to every change
- ✅ Monitor metrics for 48h after change

---

## Failure Scenario 2: Adaptive Weights Lead to Poor Decisions

### What Happened

**Context:**
- AI adjusted agent weights based on 20 decisions
- Tech Lead weight: 2.5 → 3.0 (+20%)
- Developer weight: 1.5 → 1.2 (-20%)
- Expected: Better decisions
- Actual: Worse decisions (accuracy dropped 85% → 78%)

**Timeline:**
- Week 1: Collected 20 decisions
- Week 2: Adjusted weights
- Week 3: Decision accuracy dropped
- Week 4: Detected issue, rolled back weights

### Why It Failed

**Root Cause:**
- Sample size too small (20 decisions)
- Tech Lead had lucky streak (not sustainable)
- Developer had unlucky streak (temporary)
- Weights over-adjusted based on noise, not signal

**Warning Signs Missed:**
- No confidence intervals calculated
- No statistical significance testing
- Adjustment factor too aggressive (20% vs. 5%)

### How to Detect

**Automatic Detection:**
- Decision accuracy dropped below 80%
- Consensus quality degraded
- More escalations to HOE

**Manual Detection:**
- Noticed Tech Lead dominating decisions
- Developer input being ignored
- Team imbalance visible

### How to Recover

**Step 1: Rollback Weights**
```bash
# Restore previous weights
git checkout HEAD~1 .kiro/memory/agent-weights.json

# Verify restoration
cat .kiro/memory/agent-weights.json

# Commit rollback
git commit -m "revert: restore previous agent weights"
```

**Step 2: Verify Recovery**
- Decision accuracy: 78% → 85% ✓
- Consensus quality: improved ✓
- Team balance: restored ✓

**Step 3: Root Cause Analysis**
- Sample size too small
- Adjustment factor too aggressive
- No statistical validation

**Step 4: Implement Correct Fix**
- Increased minimum sample: 20 → 50 decisions
- Reduced adjustment factor: 20% → 5%
- Added confidence interval check
- Result: Stable, gradual improvement ✓

### Lessons Learned

1. **Require sufficient sample size**
   - Minimum 50 decisions (not 20)
   - Calculate confidence intervals
   - Test for statistical significance

2. **Use conservative adjustment**
   - Small increments (5% not 20%)
   - Gradual changes
   - Monitor impact

3. **Validate before applying**
   - Check if improvement is real
   - Not just random variation
   - Use statistical tests

4. **Monitor team balance**
   - No single agent should dominate
   - Diverse perspectives valuable
   - Balance is important

### Prevention Measures

**Updated Rules:**
- ✅ Minimum 50 decisions before adjustment
- ✅ Adjustment factor: 5% (not 20%)
- ✅ Require statistical significance (p < 0.05)
- ✅ Monitor team balance metrics

---

## Failure Scenario 3: Quality Gate Too Strict, Blocks Good Code

### What Happened

**Context:**
- Set quality gate threshold: 8.0/10
- Expected: Higher quality code
- Actual: 80% of PRs blocked, including good code
- Team velocity dropped 60%

**Timeline:**
- Week 1: Implemented strict quality gate (8.0)
- Week 2: 80% of PRs blocked
- Week 3: Team frustrated, velocity dropped
- Week 4: Adjusted threshold to 7.0

### Why It Failed

**Root Cause:**
- Threshold too high for current codebase
- Quality score formula not calibrated
- Blocked incremental improvements
- Perfect became enemy of good

**Warning Signs Missed:**
- No baseline quality measurement
- No calibration period
- No escape hatch for edge cases

### How to Detect

**Automatic Detection:**
- PR block rate >50%
- Velocity dropped >40%
- Cycle time increased >100%

**Manual Detection:**
- Team complaints
- Good code being blocked
- Frustration visible

### How to Recover

**Step 1: Adjust Threshold**
```json
// Update quality-gate-post-execution.kiro.hook
{
  "prompt": "... If score <7.0, BLOCK merge ..."
}
```

**Step 2: Verify Recovery**
- PR block rate: 80% → 20% ✓
- Velocity: restored ✓
- Team satisfaction: improved ✓

**Step 3: Root Cause Analysis**
- Threshold not calibrated
- Formula weights not validated
- No baseline measurement

**Step 4: Calibrate Properly**
- Measured baseline: 7.5/10
- Set threshold: 7.0/10 (below baseline)
- Gradual increase over time
- Result: Balanced quality and velocity ✓

### Lessons Learned

1. **Calibrate before enforcing**
   - Measure baseline first
   - Set threshold below baseline initially
   - Gradually increase

2. **Balance quality and velocity**
   - Perfect is enemy of good
   - Allow incremental improvements
   - Don't block progress

3. **Provide escape hatch**
   - Manual override for edge cases
   - Document exceptions
   - Learn from overrides

4. **Monitor impact**
   - PR block rate
   - Team velocity
   - Team satisfaction

### Prevention Measures

**Updated Process:**
- ✅ Measure baseline before setting threshold
- ✅ Start with threshold below baseline
- ✅ Gradual increase (0.1 per month)
- ✅ Manual override available
- ✅ Monitor block rate (<30%)

---

## Failure Scenario 4: Hook Creates Infinite Loop

### What Happened

**Context:**
- Created hook: On file edit → Run linter → Auto-fix
- Auto-fix modifies file → Triggers hook again
- Infinite loop: Edit → Lint → Fix → Edit → Lint → ...
- System hung, had to force quit

**Timeline:**
- Minute 1: Created hook
- Minute 2: Edited file
- Minute 3: System hung
- Minute 4: Force quit, disabled hook

### Why It Failed

**Root Cause:**
- Hook triggered on file edit
- Auto-fix edits file
- Triggers hook again
- No loop detection

**Warning Signs Missed:**
- No loop detection mechanism
- No max iteration limit
- No timeout

### How to Detect

**Automatic Detection:**
- CPU usage 100%
- Same hook triggered repeatedly
- Timeout exceeded

**Manual Detection:**
- System unresponsive
- Log shows repeated hook calls
- Had to force quit

### How to Recover

**Step 1: Disable Hook**
```bash
# Rename hook to disable
mv .kiro/hooks/auto-lint-fix.kiro.hook .kiro/hooks/auto-lint-fix.kiro.hook.disabled
```

**Step 2: Fix Hook Logic**
```json
{
  "name": "Auto Lint Fix",
  "when": {
    "type": "fileEdited",
    "patterns": "*.ts,*.js"
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint:fix",
    "timeout": 30
  }
}
```

**Key Fix:** Use `runCommand` (doesn't trigger file edit event) instead of `askAgent` (which might edit files)

**Step 3: Add Loop Detection**
- Track hook invocations
- Max 3 invocations per file per minute
- Timeout after 30 seconds

**Step 4: Test Thoroughly**
- Test with sample file
- Verify no infinite loop
- Monitor for 24h

### Lessons Learned

1. **Detect circular dependencies**
   - Hook A triggers Tool X
   - Tool X triggers Hook A
   - Infinite loop

2. **Add safeguards**
   - Max iterations limit
   - Timeout
   - Loop detection

3. **Use appropriate actions**
   - `runCommand` for external tools
   - `askAgent` for AI decisions
   - Understand trigger implications

4. **Test edge cases**
   - What if hook triggers itself?
   - What if tool fails?
   - What if timeout?

### Prevention Measures

**Added to Hook Design:**
- ✅ Analyze circular dependencies before creating hook
- ✅ Add max iteration limit (3 per minute)
- ✅ Add timeout (30-60 seconds)
- ✅ Use `runCommand` for external tools
- ✅ Test thoroughly before activating

---

## Failure Scenario 5: AI Creates Bad Hook, Causes Issues

### What Happened

**Context:**
- AI created hook: On commit → Run all tests
- Tests take 10 minutes
- Blocks every commit for 10 minutes
- Team can't work efficiently

**Timeline:**
- Day 1: Created hook
- Day 2: Team frustrated (commits blocked)
- Day 3: Disabled hook
- Day 4: Created better hook (run tests async)

### Why It Failed

**Root Cause:**
- Hook blocks commit
- Tests too slow for blocking operation
- Should be async, not blocking

**Warning Signs Missed:**
- No consideration of test duration
- No async option
- No impact analysis

### How to Detect

**Automatic Detection:**
- Commit time >5 minutes
- Team velocity dropped

**Manual Detection:**
- Team complaints
- Commits taking too long
- Frustration visible

### How to Recover

**Step 1: Disable Hook**
```bash
mv .kiro/hooks/test-on-commit.kiro.hook .kiro/hooks/test-on-commit.kiro.hook.disabled
```

**Step 2: Create Better Hook**
```json
{
  "name": "Test on Commit (Async)",
  "when": {
    "type": "postCommit"
  },
  "then": {
    "type": "runCommand",
    "command": "npm test &",
    "timeout": 0
  }
}
```

**Key Fix:** Run tests async (background), don't block commit

**Step 3: Alternative Approach**
- Run fast tests on commit (< 30s)
- Run full tests on push (CI/CD)
- Best of both worlds

### Lessons Learned

1. **Consider operation duration**
   - Fast operations: Can block
   - Slow operations: Must be async

2. **Don't block critical workflows**
   - Commits should be fast
   - Tests can run in background
   - CI/CD for full validation

3. **Provide feedback**
   - Show tests running
   - Notify when complete
   - Report failures

4. **Test impact**
   - How long does it take?
   - Does it block workflow?
   - Is it acceptable?

### Prevention Measures

**Hook Design Guidelines:**
- ✅ Operations <30s: Can block
- ✅ Operations >30s: Must be async
- ✅ Critical workflows: Never block
- ✅ Provide feedback on async operations
- ✅ Test impact before deploying

---

## Common Failure Patterns

### Pattern 1: Premature Optimization

**Symptoms:**
- Optimizing without measuring
- Assuming bottleneck
- Making things worse

**Prevention:**
- Measure first
- Profile to find real bottleneck
- Validate improvement

### Pattern 2: Over-Adjustment

**Symptoms:**
- Large changes based on small data
- Weights swing wildly
- System unstable

**Prevention:**
- Require sufficient sample size
- Use conservative adjustments
- Validate statistically

### Pattern 3: Too Strict Standards

**Symptoms:**
- Blocking good work
- Team frustrated
- Velocity drops

**Prevention:**
- Calibrate thresholds
- Start lenient, increase gradually
- Provide escape hatch

### Pattern 4: Circular Dependencies

**Symptoms:**
- Infinite loops
- System hangs
- Resource exhaustion

**Prevention:**
- Analyze dependencies
- Add loop detection
- Set timeouts

### Pattern 5: Blocking Operations

**Symptoms:**
- Slow workflows
- Team blocked
- Productivity drops

**Prevention:**
- Keep operations fast (<30s)
- Use async for slow operations
- Don't block critical workflows

---

## Recovery Checklist

When a failure occurs:

- [ ] **Detect** - Identify the issue (automatic or manual)
- [ ] **Assess** - Determine impact and severity
- [ ] **Rollback** - Restore previous working state
- [ ] **Verify** - Confirm recovery successful
- [ ] **Analyze** - Identify root cause
- [ ] **Fix** - Implement correct solution
- [ ] **Test** - Validate fix works
- [ ] **Document** - Record lesson learned
- [ ] **Prevent** - Update processes to prevent recurrence
- [ ] **Share** - Communicate with team

---

## Summary

**Failures are learning opportunities, not disasters.**

Key Principles:
- ✅ Detect failures quickly
- ✅ Rollback safely
- ✅ Analyze root cause
- ✅ Implement prevention
- ✅ Document lessons
- ✅ Share knowledge

**The goal is not zero failures, but rapid recovery and continuous learning.**

---

**Version:** 1.0.0  
**Last Updated:** March 5, 2026  
**Next Review:** March 12, 2026
