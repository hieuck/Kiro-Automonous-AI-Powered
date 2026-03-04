---
name: semi-afk-game-design
description: Design and implement engaging semi-AFK MMORPG mechanics. Use when designing auto-hunt systems, idle gameplay, player engagement strategies, monetization balance (free vs premium), progression systems, or anti-cheat for automated gameplay. Balances automation with active play incentives.
metadata:
  author: Kiro AI Team
  version: 1.0.0
  category: game-design
  tags: [game-design, semi-afk, auto-hunt, monetization, engagement, mmorpg]
---

# Semi-AFK Game Design

## Overview

Design engaging semi-AFK MMORPG mechanics that balance automation with player engagement, ensuring fair monetization and preventing exploitation.

## When to Use

- Designing auto-hunt system mechanics
- Creating idle/AFK gameplay features
- Balancing free vs premium benefits
- Designing player engagement systems
- Creating progression systems for semi-AFK
- Implementing anti-cheat for automation
- Monetization strategy design

## Core Principles

### 1. Respect Player Time
- Allow meaningful progress while AFK
- Don't punish offline players
- Provide catch-up mechanics
- Balance daily limits fairly

### 2. Maintain Engagement
- Auto-hunt shouldn't replace all gameplay
- Manual play should feel rewarding
- Provide reasons to actively play
- Create social interaction opportunities

### 3. Fair Monetization
- Free players progress reasonably
- Premium provides convenience, not power
- No pay-to-win mechanics
- Clear value proposition

### 4. Prevent Exploitation
- Anti-bot measures
- Rate limiting
- Server-side validation
- Detect and prevent exploits

## Auto-Hunt System Design

### Efficiency Tiers

```typescript
interface AutoHuntEfficiency {
  free: {
    damage: 0.7,      // 70% of manual
    experience: 0.7,
    loot: 0.7,
    dailyLimit: 240,  // 4 hours
  },
  premium: {
    damage: 0.9,      // 90% of manual
    experience: 0.9,
    loot: 0.9,
    dailyLimit: null, // Unlimited
  }
}
```

### Why Efficiency Penalties?

1. Prevents auto-hunt from replacing manual play
2. Rewards active engagement
3. Maintains game economy balance
4. Provides value for premium

### AI Behavior States

```
IDLE → SEARCHING → MOVING → ATTACKING → LOOTING
                              ↓
                        USING_POTION
                              ↓
                      RETURNING_TO_SAFE
                              ↓
                           STUCK
```

### Configuration Options

**Basic:**
- Auto-combat (on/off)
- Auto-loot (on/off)
- Hunt radius (10-200m)

**Advanced:**
- Auto-potion (on/off)
- HP threshold (0-100%)
- MP threshold (0-100%)
- Return on low HP
- Auto-skill rotation (premium)

## Engagement Mechanics

### Active Play Incentives

**Manual Play Bonuses:**
- 100% efficiency (vs 70-90% auto)
- Better loot quality
- Bonus experience events
- Skill mastery progression
- Social features

**Time-Limited Events:**
- Boss spawns (manual required)
- PvP tournaments
- Guild wars
- Special quests
- Limited dungeons

**Social Features:**
- Party system (bonus exp/loot)
- Guild system (shared benefits)
- Trade system
- Chat system
- Leaderboards

## Monetization Design

### Free-to-Play Model

**Free Users:**
- Full game access
- 4 hours daily auto-hunt
- 70% efficiency
- All core features
- Reasonable progression

**Premium Users:**
- Unlimited auto-hunt
- 90% efficiency
- Auto-skill rotation
- Priority support
- Cosmetic bonuses

### Premium Value Proposition

**Time Savings:**
- Unlimited auto-hunt
- Higher efficiency
- Auto-skill rotation

**Convenience:**
- More config options
- Priority login
- Extra inventory
- Faster travel

**Cosmetics:**
- Exclusive skins
- Special effects
- Unique titles
- Pet companions

**What Premium Should NOT Be:**
- ❌ Stronger stats
- ❌ Better equipment
- ❌ Exclusive content
- ❌ Unfair advantages

## Technical Implementation

### Server-Side Tick

```typescript
// Run every 500ms
async function autoHuntTick(characterId: string) {
  const character = await getCharacter(characterId);
  const config = await getAutoHuntConfig(characterId);
  
  // Execute state logic
  switch (character.autoHuntState) {
    case 'SEARCHING':
      await searchForTarget(character, config);
      break;
    case 'ATTACKING':
      await attackTarget(character, config);
      break;
    // ... other states
  }
  
  await sendStatusUpdate(characterId);
}
```

### Client-Side UI

**Status Display:**
- Current state
- Monsters killed
- Items looted
- Experience gained
- Time remaining (free)

**Configuration Panel:**
- Easy to understand
- Real-time updates
- Visual feedback
- Help tooltips

## Best Practices

### Do
- ✅ Balance automation with engagement
- ✅ Respect player time
- ✅ Provide meaningful choices
- ✅ Test with real players
- ✅ Iterate based on feedback

### Don't
- ❌ Make auto-hunt better than manual
- ❌ Create pay-to-win
- ❌ Ignore player feedback
- ❌ Punish casual players
- ❌ Allow exploitation

## Common Pitfalls

**Auto-Hunt Too Strong:**
- Problem: Nobody plays manually
- Solution: Efficiency penalties, manual bonuses

**Auto-Hunt Too Weak:**
- Problem: Nobody uses it
- Solution: Increase efficiency

**Pay-to-Win:**
- Problem: Premium too powerful
- Solution: Convenience only

**No Engagement:**
- Problem: Players just AFK
- Solution: Active play incentives

## Success Metrics

- Daily active users
- Session duration
- Retention rates
- Auto-hunt vs manual play ratio
- Conversion rate (free to premium)
- Revenue per user
- Player satisfaction

---

**Provides comprehensive guidance for designing engaging semi-AFK MMORPG mechanics.**
