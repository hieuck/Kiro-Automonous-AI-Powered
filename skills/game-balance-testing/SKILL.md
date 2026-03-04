---
name: game-balance-testing
description: Test and validate game balance for semi-AFK MMORPG. Use when testing auto-hunt efficiency (70% free, 90% premium), monster difficulty, loot rates, experience gain, combat formulas, or economy balance. Validates progression curves, stat scaling, and premium vs free fairness.
metadata:
  author: Kiro AI Team
  version: 1.0.0
  category: game-development
  tags: [testing, balance, mmorpg, auto-hunt, game-design]
---

# Game Balance Testing

## Overview

Test and validate game balance for semi-AFK MMORPG mechanics, ensuring fair gameplay between manual and auto-hunt modes.

## When to Use

- Testing auto-hunt efficiency (70% free vs 90% premium)
- Validating monster difficulty vs character level
- Testing loot drop rates and item balance
- Verifying experience gain and leveling curves
- Testing combat damage calculations
- Validating economy balance (gold, items, progression)
- Ensuring premium benefits don't create pay-to-win

## Testing Approach

### 1. Auto-Hunt Efficiency Testing

Validate efficiency penalties:
- Free users: 70% efficiency (damage, exp, loot)
- Premium users: 90% efficiency
- Daily limits enforced correctly

```typescript
// Property-based test for auto-hunt efficiency
fc.assert(
  fc.property(
    fc.integer({ min: 1, max: 400 }), // character level
    fc.boolean(), // isPremium
    (level, isPremium) => {
      const efficiency = calculateAutoHuntEfficiency(level, isPremium);
      const expected = isPremium ? 0.9 : 0.7;
      return Math.abs(efficiency - expected) < 0.01;
    }
  )
);
```

### 2. Monster Balance Testing

Test monster difficulty scaling:
- HP/damage appropriate for level range
- Spawn rates and density
- Aggro range and behavior
- Boss mechanics and difficulty

```typescript
// Simulation test for monster balance
const result = await simulateMonsterFight({
  characterLevel: 50,
  monsterType: 'Orc',
  iterations: 100,
});

// Character should win 80-95% of fights at appropriate level
expect(result.winRate).toBeGreaterThan(0.8);
expect(result.winRate).toBeLessThan(0.95);
```

### 3. Progression Balance

Test leveling curves:
- Experience requirements per level
- Skill progression and unlock timing
- Equipment progression
- Stat scaling effectiveness

```typescript
// Test leveling curve smoothness
const levels = Array.from({ length: 400 }, (_, i) => i + 1);
const expRequirements = levels.map(getExpRequirement);

// Check for exponential growth without sudden spikes
for (let i = 1; i < expRequirements.length; i++) {
  const ratio = expRequirements[i] / expRequirements[i - 1];
  expect(ratio).toBeGreaterThan(1.0);
  expect(ratio).toBeLessThan(1.2); // Max 20% increase per level
}
```

### 4. Economy Balance

Test economic systems:
- Gold drop rates
- Item prices (buy/sell)
- Trade system fairness
- Potion costs vs income

```typescript
// Simulate 1 hour of gameplay economics
const session = await simulateGameSession({
  duration: 3600,
  characterLevel: 50,
  activities: ['hunting', 'questing', 'trading'],
});

// Income should exceed expenses by 20-50%
const profit = session.goldEarned - session.goldSpent;
const profitRatio = profit / session.goldSpent;
expect(profitRatio).toBeGreaterThan(0.2);
expect(profitRatio).toBeLessThan(0.5);
```

### 5. Combat Balance

Test combat formulas:
- Damage calculations
- Defense effectiveness
- Critical hit rates
- Skill damage and cooldowns

```typescript
// Property-based test for damage formula
fc.assert(
  fc.property(
    fc.integer({ min: 1, max: 1000 }), // attack
    fc.integer({ min: 1, max: 1000 }), // defense
    (attack, defense) => {
      const damage = calculateDamage(attack, defense);
      // Damage should be positive and not exceed attack
      return damage >= 0 && damage <= attack;
    }
  )
);
```

## Balance Validation Checklist

### Auto-Hunt Balance
- [ ] Free users get 70% efficiency
- [ ] Premium users get 90% efficiency
- [ ] Daily limit enforced (240 min free)
- [ ] Premium unlimited usage
- [ ] Auto-hunt doesn't outperform manual
- [ ] Efficiency penalties applied correctly

### Monster Balance
- [ ] Monsters appropriate for level range
- [ ] Solo-able by characters in range
- [ ] Group content requires cooperation
- [ ] Boss difficulty appropriate
- [ ] Spawn rates prevent overcrowding
- [ ] Aggro mechanics work correctly

### Progression Balance
- [ ] Leveling curve feels smooth
- [ ] No "dead zones" in progression
- [ ] Equipment upgrades meaningful
- [ ] Skills unlock appropriately
- [ ] Stats scale well
- [ ] End-game accessible but challenging

### Economy Balance
- [ ] Gold income matches expenses
- [ ] Potion costs sustainable
- [ ] Equipment prices appropriate
- [ ] Trade system prevents exploits
- [ ] Premium not pay-to-win
- [ ] Free players progress reasonably

### Combat Balance
- [ ] Damage formulas correct
- [ ] Defense reduces damage appropriately
- [ ] Critical hits impactful not OP
- [ ] Skills balanced
- [ ] No dominant strategies
- [ ] Counter-play exists

## Red Flags

### Progression Issues
- Players stuck at certain levels
- Exponential difficulty spikes
- Trivial content (too easy)
- Impossible content (too hard)

### Economy Issues
- Inflation (gold losing value)
- Deflation (items too expensive)
- Exploits (duplication, etc.)
- Pay-to-win concerns

### Balance Issues
- Dominant strategies (everyone same build)
- Useless content (nobody plays)
- Broken mechanics (infinite loops)
- Unfair advantages (premium too strong)

## Testing Commands

```bash
# Run balance tests
npm run test:balance

# Run property-based tests
npm run test:property

# Run simulation tests
npm run test:simulation

# Generate balance report
npm run balance:report
```

## Reporting Template

```markdown
# Game Balance Report

**Date:** YYYY-MM-DD
**Test Scope:** [Auto-Hunt / Monsters / Economy]

## Summary
[Brief overview]

## Test Results

### Auto-Hunt Efficiency
- Free: X% (expected 70%)
- Premium: Y% (expected 90%)
- Status: ✅ PASS / ❌ FAIL

### Monster Balance
- Level range: X-Y
- Difficulty: Appropriate / Too Easy / Too Hard
- Status: ✅ PASS / ❌ FAIL

## Issues Found
1. [Issue] - Severity: Critical/High/Medium/Low
   - Impact: [Description]
   - Fix: [Recommendation]

## Recommendations
- [Action 1]
- [Action 2]
```

## Best Practices

### Do
- ✅ Test with real player data
- ✅ Use statistical analysis
- ✅ Test edge cases and exploits
- ✅ Consider player psychology
- ✅ Balance for long-term health

### Don't
- ❌ Balance on single data points
- ❌ Ignore player feedback
- ❌ Change without testing
- ❌ Create pay-to-win
- ❌ Nerf fun without reason

## Integration

### Pre-Release
- Run balance tests before release
- Validate formula changes
- Test new content thoroughly
- Get QA sign-off

### Post-Release
- Monitor live metrics
- Gather player feedback
- Identify issues quickly
- Plan balance patches

### Continuous Improvement
- Track metrics over time
- Identify trends
- Adjust based on data
- Iterate regularly

---

**Ensures fair, fun, and sustainable game balance for semi-AFK MMORPG gameplay.**
