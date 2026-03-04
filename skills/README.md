# Kiro Skills for Semi-AFK MMORPG Development

This directory contains **4 custom skills** following the [Agent Skills standard](https://github.com/modelcontextprotocol/agent-skills) for developing the Mu Đại Thiên Sứ H5 semi-AFK MMORPG game.

## 🎯 Why Only 4 Skills?

After cleanup on March 4, 2026, we removed 953 external skill directories from antigravity-awesome-skills repository. These 4 custom skills are:
- **Focused** - Specifically tailored for semi-AFK MMORPG development
- **Relevant** - Directly applicable to our game project
- **Maintained** - Easy to update and improve
- **Efficient** - No clutter, fast to load and use
- **Standard-Compliant** - Follow Agent Skills open standard

## 📁 Skill Structure

Each skill follows the Agent Skills standard:

```
skill-name/
└── SKILL.md           # Required: Skill definition with frontmatter
```

## Available Skills

### 1. Game Balance Testing
**Path:** `game-balance-testing/SKILL.md`  
**Description:** Test and validate game balance for semi-AFK MMORPG

**Use when:**
- Testing auto-hunt efficiency (70% free, 90% premium)
- Validating monster difficulty and spawn rates
- Testing loot drop rates and item balance
- Verifying experience gain and leveling curves
- Testing combat damage calculations
- Validating economy balance

**Invoke:** Type `/` in chat and select "game-balance-testing"

---

### 2. Semi-AFK Game Design
**Path:** `semi-afk-game-design/SKILL.md`  
**Description:** Design and implement engaging semi-AFK MMORPG mechanics

**Use when:**
- Designing auto-hunt system mechanics
- Creating idle/AFK gameplay features
- Balancing free vs premium benefits
- Designing player engagement systems
- Creating progression systems for semi-AFK
- Implementing anti-cheat for automation

**Invoke:** Type `/` in chat and select "semi-afk-game-design"

---

### 3. MMORPG Security
**Path:** `mmorpg-security/SKILL.md`  
**Description:** Implement comprehensive security for multiplayer online games

**Use when:**
- Implementing anti-cheat systems
- Adding server-side validation
- Detecting and preventing bots
- Preventing item/gold duplication
- Securing player accounts
- Protecting sensitive data

**Invoke:** Type `/` in chat and select "mmorpg-security"

---

### 4. Realtime Game Optimization
**Path:** `realtime-game-optimization/SKILL.md`  
**Description:** Optimize performance for real-time multiplayer MMORPG

**Use when:**
- Optimizing WebSocket message frequency
- Improving auto-hunt tick performance
- Optimizing database queries
- Implementing Redis caching
- Reducing server load
- Improving client FPS

**Invoke:** Type `/` in chat and select "realtime-game-optimization"

---

## How to Use Skills

### Method 1: Automatic Activation
Kiro automatically activates skills when your request matches the skill's description.

```
"Test auto-hunt efficiency for level 50 characters"
→ Automatically activates game-balance-testing skill
```

### Method 2: Manual Invocation
Type `/` in the chat input to see available skills as slash commands.

```
/game-balance-testing
/semi-afk-game-design
/mmorpg-security
/realtime-game-optimization
```

### Method 3: View in Panel
Open "Agent Steering & Skills" section in the Kiro panel to view and manage skills.

---

## Agent Skills Standard

These skills follow the [Agent Skills open standard](https://github.com/modelcontextprotocol/agent-skills), which means:

- **Portable** - Can be imported/exported across compatible AI tools
- **Discoverable** - Kiro loads name and description at startup
- **Progressive** - Full instructions loaded only when activated
- **Reusable** - Can be shared with the community

### Frontmatter Format

```markdown
---
name: skill-name
description: When to use this skill (max 1024 chars)
metadata:
  author: Kiro AI Team
  version: 1.0.0
  category: game-development
  tags: [tag1, tag2, tag3]
---

# Skill Content
...
```

---

## Skill Scope

These are **workspace skills** (`.kiro/skills/`) that apply only to this project.

For personal workflows across all projects, create **global skills** in `~/.kiro/skills/`.

---

## Creating New Skills

If you need additional skills:

1. Create a new folder: `.kiro/skills/my-skill/`
2. Create `SKILL.md` with proper frontmatter
3. Write clear description (Kiro uses this for activation)
4. Keep SKILL.md focused (detailed docs in references/)
5. Test with real scenarios

**Template:**

```markdown
---
name: my-skill
description: Clear description of when to use this skill
metadata:
  author: Your Name
  version: 1.0.0
  category: category-name
  tags: [tag1, tag2]
---

# My Skill

## Overview
[What this skill does]

## When to Use
- Use when [scenario 1]
- Use when [scenario 2]

## Instructions
[Step-by-step guidance]

## Examples
[Code examples]
```

---

## Cleanup History

**March 4, 2026:**
- Removed 953 external skill directories
- Removed 23 documentation files
- Converted 4 custom skills to Agent Skills standard
- Space saved: ~500 MB
- Files removed: ~10,000+

**Result:** Faster performance, clearer focus, standard-compliant

See `.kiro/reports/cleanup-2026-03-04.md` for details.

---

## Best Practices

### Do
- ✅ Write precise descriptions (Kiro uses for activation)
- ✅ Keep SKILL.md focused
- ✅ Use scripts for deterministic tasks
- ✅ Choose right scope (workspace vs global)
- ✅ Follow Agent Skills standard

### Don't
- ❌ Import large skill collections
- ❌ Create vague descriptions
- ❌ Mix multiple concerns in one skill
- ❌ Forget to test activation
- ❌ Ignore standard format

---

## Related Documentation

- **Skills Usage Guide:** `.kiro/steering/skills-usage-guide.md`
- **Cleanup Report:** `.kiro/reports/cleanup-2026-03-04.md`
- **Agent Skills Standard:** https://github.com/modelcontextprotocol/agent-skills
- **Product Overview:** `.kiro/steering/product.md`
- **Architecture Guidelines:** `.kiro/steering/architecture-guidelines.md`

---

**Last Updated:** March 4, 2026  
**Version:** 3.0.0 (Agent Skills Standard)  
**Status:** ✅ Active and Optimized
