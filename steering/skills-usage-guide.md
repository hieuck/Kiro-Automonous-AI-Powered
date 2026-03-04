---
inclusion: auto
name: skills-usage-guide
description: Guide for using Kiro Skills and Steering for semi-AFK MMORPG development. Use when learning about skills, steering, or how to leverage Kiro's knowledge system.
---

# Skills & Steering Usage Guide
## Semi-AFK MMORPG Development

## Overview

This guide explains how to use Kiro's two knowledge systems:
- **Skills** - Portable, on-demand instruction packages (Agent Skills standard)
- **Steering** - Persistent workspace knowledge (markdown files)

## Skills vs Steering

### Skills (`.kiro/skills/`)
- **Purpose:** Specialized workflows and procedures
- **Format:** Agent Skills standard (portable)
- **Loading:** On-demand (progressive disclosure)
- **Scope:** Workspace or global
- **Use for:** Testing procedures, design patterns, optimization techniques

### Steering (`.kiro/steering/`)
- **Purpose:** Persistent project knowledge
- **Format:** Markdown with optional frontmatter
- **Loading:** Always, conditional, manual, or auto
- **Scope:** Workspace, global, or team
- **Use for:** Standards, conventions, architecture, tech stack

## Available Skills

### 1. Game Balance Testing
**Path:** `game-balance-testing/SKILL.md`  
**Category:** game-development

**Use when:**
- Testing auto-hunt efficiency (70% free, 90% premium)
- Validating monster difficulty and spawn rates
- Testing loot drop rates and item balance
- Verifying experience gain and leveling curves
- Testing combat damage calculations
- Validating economy balance

**Activation:**
- Automatic: "Test auto-hunt efficiency for level 50"
- Manual: `/game-balance-testing`
- Panel: Agent Steering & Skills section

---

### 2. Semi-AFK Game Design
**Path:** `semi-afk-game-design/SKILL.md`  
**Category:** game-design

**Use when:**
- Designing auto-hunt system mechanics
- Creating idle/AFK gameplay features
- Balancing free vs premium benefits
- Designing player engagement systems
- Creating progression systems for semi-AFK
- Implementing anti-cheat for automation

**Activation:**
- Automatic: "Design auto-hunt notification system"
- Manual: `/semi-afk-game-design`
- Panel: Agent Steering & Skills section

---

### 3. MMORPG Security
**Path:** `mmorpg-security/SKILL.md`  
**Category:** security

**Use when:**
- Implementing anti-cheat systems
- Adding server-side validation
- Detecting and preventing bots
- Preventing item/gold duplication
- Securing player accounts
- Protecting sensitive data

**Activation:**
- Automatic: "Implement anti-cheat for auto-hunt"
- Manual: `/mmorpg-security`
- Panel: Agent Steering & Skills section

---

### 4. Realtime Game Optimization
**Path:** `realtime-game-optimization/SKILL.md`  
**Category:** performance

**Use when:**
- Optimizing WebSocket message frequency
- Improving auto-hunt tick performance
- Optimizing database queries
- Implementing Redis caching
- Reducing server load
- Improving client FPS

**Activation:**
- Automatic: "Optimize WebSocket latency"
- Manual: `/realtime-game-optimization`
- Panel: Agent Steering & Skills section

---

## Active Steering Files

### Always Included (Foundation)

**1. Product Overview** (`product.md`)
- Game type: Semi-AFK MMORPG
- Core features: Auto-hunt, progression, combat
- Target platform: HTML5 browser game

**2. Technology Stack** (`tech.md`)
- Frontend: Phaser 3, TypeScript, Webpack
- Backend: Node.js, Express, WebSocket
- Database: PostgreSQL, Redis
- Testing: Jest, fast-check

**3. Project Structure** (`structure.md`)
- Monorepo organization
- Client/server packages
- Layered architecture
- Naming conventions

**4. Architecture Guidelines** (`architecture-guidelines.md`)
- Layered architecture principles
- Design patterns
- API design
- Database design

**5. Security Policies** (`security-policies.md`)
- Authentication & authorization
- Anti-cheat measures
- Data protection
- Autonomous security operations

**6. Infrastructure Runbook** (`infrastructure-runbook.md`)
- System architecture
- Development environment setup
- Database operations
- Deployment procedures
- Troubleshooting guide

**7. Git Workflow** (`git-workflow.md`)
- Dual repository management (`.kiro/` and `muh5/`)
- Commit conventions
- Branch strategy

**8. AI Development Workflow** (`ai-development-workflow.md`)
- 100% autonomous AI team workflow
- Task assignment
- Code review (AI-to-AI)
- Quality gates

**9. Autonomous Operations Guide** (`autonomous-operations-guide.md`)
- How autonomous operations work
- Decision-making process
- Self-assessment cycles
- Escalation paths

**10. Autonomous Decision Framework** (`autonomous-decision-framework.md`)
- Decision categories
- Natural language decision engine
- Consensus calculation
- Learning system

### Conditional Inclusion (File Match)

**API Standards** (`api-standards.md`)
- Pattern: `**/api/**/*`, `**/routes/**/*`, `**/controllers/**/*`
- RESTful API design
- Endpoint naming
- HTTP methods

**Testing Standards** (`testing-standards.md`)
- Pattern: `**/*.test.*`, `**/*.spec.*`, `**/tests/**/*`, `**/__tests__/**/*`
- Test structure (AAA pattern)
- Coverage requirements
- Testing approach

### Auto Inclusion

**Skills Usage Guide** (`skills-usage-guide.md`) - This file
- Description: Guide for using Kiro Skills and Steering
- Auto-activates when learning about skills/steering

### Manual Inclusion

**Vietnamese Communication** (`vietnamese-communication.md`)
- Use: `#vietnamese-communication` in chat
- Ensures Vietnamese responses when user speaks Vietnamese

**MCP Integration** (`mcp-integration.md`)
- Use: `#mcp-integration` in chat
- Guide for using MCP servers (AWS, Terraform, etc.)

**Dev Team Standards** (`dev-team-standards.md`)
- Use: `#dev-team-standards` in chat
- Code quality standards, naming conventions

---

## How to Use Skills

### Method 1: Automatic Activation
Kiro matches your request against skill descriptions:

```
"Test auto-hunt efficiency for level 50 characters"
→ Activates game-balance-testing skill
→ Loads full SKILL.md content
→ Follows testing procedures
```

### Method 2: Manual Invocation (Slash Commands)
Type `/` in chat to see available skills:

```
/game-balance-testing
/semi-afk-game-design
/mmorpg-security
/realtime-game-optimization
```

### Method 3: Panel UI
1. Open "Agent Steering & Skills" section in Kiro panel
2. Browse available skills
3. Click to activate

---

## How to Use Steering

### Always Included Files
No action needed - automatically loaded in every interaction:
- `product.md`
- `tech.md`
- `structure.md`
- `architecture-guidelines.md`
- `security-policies.md`
- etc.

### Conditional Files (File Match)
Automatically loaded when working with matching files:
- Working on API? → `api-standards.md` loads
- Writing tests? → `testing-standards.md` loads

### Auto Inclusion Files
Automatically loaded when request matches description:
- Learning about skills? → `skills-usage-guide.md` loads

### Manual Files
Reference with `#` in chat:
```
"#vietnamese-communication Giải thích auto-hunt system"
"#mcp-integration How do I use AWS MCP server?"
"#dev-team-standards Review this code"
```

Or use slash commands:
```
/vietnamese-communication
/mcp-integration
/dev-team-standards
```

---

## Best Practices

### For Skills

**Do:**
- ✅ Let Kiro auto-activate skills when possible
- ✅ Use slash commands for explicit control
- ✅ Write clear requests that match descriptions
- ✅ Combine multiple skills when needed

**Don't:**
- ❌ Manually explain procedures that skills cover
- ❌ Create duplicate skills for similar tasks
- ❌ Ignore skill recommendations

### For Steering

**Do:**
- ✅ Keep steering files focused (one domain per file)
- ✅ Use clear names (e.g., `api-rest-conventions.md`)
- ✅ Include context and examples
- ✅ Choose appropriate inclusion mode
- ✅ Maintain regularly

**Don't:**
- ❌ Include sensitive data (API keys, passwords)
- ❌ Create overly broad steering files
- ❌ Forget to update after architecture changes
- ❌ Use always-included for rarely-needed context

---

## When to Use What

### Use Skills When:
- You need specialized procedures (testing, optimization)
- You want portable, shareable workflows
- You need on-demand activation
- You want progressive disclosure (load only when needed)

### Use Steering When:
- You need persistent project knowledge
- You want standards applied consistently
- You need context in every interaction
- You want conditional loading based on file types

---

## Examples

### Example 1: Testing Auto-Hunt

**Using Skills:**
```
"Test auto-hunt efficiency for free users at level 50"
→ Activates game-balance-testing skill
→ Provides testing procedures
→ Suggests property-based tests
→ Generates test code
```

**Using Steering:**
```
Working on auto-hunt tests
→ testing-standards.md loads (file match)
→ Applies AAA pattern
→ Ensures 80% coverage
→ Follows Jest conventions
```

### Example 2: Designing New Feature

**Using Skills:**
```
"Design a notification system for auto-hunt completion"
→ Activates semi-afk-game-design skill
→ Provides engagement mechanics guidance
→ Suggests notification strategies
→ Considers free vs premium
```

**Using Steering:**
```
Creating new feature
→ product.md provides context (always included)
→ tech.md suggests tech stack (always included)
→ architecture-guidelines.md ensures patterns (always included)
```

### Example 3: Security Implementation

**Using Skills:**
```
"Implement bot detection for auto-hunt"
→ Activates mmorpg-security skill
→ Provides behavioral analysis code
→ Suggests captcha challenges
→ Implements rate limiting
```

**Using Steering:**
```
Implementing security
→ security-policies.md enforces standards (always included)
→ Ensures server-side validation
→ Applies defense in depth
→ Follows least privilege
```

---

## Creating New Skills

If you need a new skill:

1. Create folder: `.kiro/skills/my-skill/`
2. Create `SKILL.md` with frontmatter:

```markdown
---
name: my-skill
description: Clear description of when to use this skill (max 1024 chars)
metadata:
  author: Your Name
  version: 1.0.0
  category: category-name
  tags: [tag1, tag2, tag3]
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

3. Test activation with real requests

---

## Creating New Steering

If you need new steering:

1. Open "Agent Steering & Skills" panel
2. Click `+` button
3. Choose scope (workspace or global)
4. Choose filename (e.g., `my-standards.md`)
5. Add frontmatter (optional):

```markdown
---
inclusion: fileMatch
fileMatchPattern: "**/*.tsx"
---

# My Standards

[Your guidance here]
```

6. Write guidance in natural language
7. Use `Refine` button to improve (optional)

---

## Troubleshooting

### Skill Not Activating?
- Check description matches your request
- Try manual invocation with `/skill-name`
- Verify SKILL.md has proper frontmatter
- Check skill is in correct folder

### Steering Not Loading?
- Check inclusion mode in frontmatter
- Verify file pattern matches (for fileMatch)
- Check file is in `.kiro/steering/`
- Try manual inclusion with `#steering-name`

### Conflicts Between Skills and Steering?
- Steering provides persistent context
- Skills provide specialized procedures
- Both work together - not conflicting
- Skills use steering context when activated

---

## Related Documentation

- **Skills README:** `.kiro/skills/README.md`
- **Agent Skills Standard:** https://github.com/modelcontextprotocol/agent-skills
- **Cleanup Report:** `.kiro/reports/cleanup-2026-03-04.md`
- **Conversion Report:** `.kiro/reports/skills-agent-standard-conversion-2026-03-04.md`

---

**Last Updated:** March 4, 2026  
**Version:** 2.0.0 (Skills + Steering)  
**Status:** ✅ Active
