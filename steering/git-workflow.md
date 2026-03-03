---
inclusion: always
---

# Git Workflow - Dual Repository Management

## Overview

This project has TWO separate Git repositories that must be managed independently:

1. **Team Dev Repository** (`.kiro/`) - For AI team operations
2. **Project Repository** (`muh5/`) - For game project code

**CRITICAL:** Never mix commits between these repositories!

---

## Repository Structure

```
workspace/
├── .kiro/              # Team Dev Git Repository
│   ├── .git/          # Team dev git (autonomous AI team)
│   ├── agents/
│   ├── hooks/
│   ├── memory/
│   ├── skills/
│   ├── steering/
│   └── ...
│
└── muh5/              # Project Git Repository
    ├── .git/          # Project git (game code)
    ├── packages/
    │   ├── client/
    │   └── server/
    └── ...
```

---

## Git Workflow Rules

### Rule 1: Team Dev Changes → `.kiro/` Repository

**When to use `.kiro/` git:**
- Changes to team infrastructure (agents, hooks, skills, steering)
- Team documentation (reports, summaries, verification docs)
- Team memory (decisions, metrics, learning patterns)
- Team configuration (settings, templates)
- Autonomous operations logs

**How to commit:**
```bash
# Working directory: .kiro/
git add [files]
git commit -m "docs: [description]"
# or
git commit -m "feat: [description]"
# or
git commit -m "fix: [description]"
```

**Examples:**
```bash
# Team dev changes
cd .kiro
git add PHASE-4-COMPLETION-REPORT.md
git commit -m "docs: complete Phase 4 - first real tasks"

git add memory/decisions/dec-2026-03-03-002.json
git commit -m "feat: log combat system decision"

git add steering/git-workflow.md
git commit -m "docs: add git workflow guidelines"
```

---

### Rule 2: Project Changes → `muh5/` Repository

**When to use `muh5/` git:**
- Game code changes (client, server)
- Game features implementation
- Bug fixes in game code
- Game tests (unit, integration, property tests)
- Game documentation (README, API docs)
- Game configuration (package.json, tsconfig.json)

**How to commit:**
```bash
# Working directory: muh5/
git add [files]
git commit -m "[type](scope): [description]"
```

**Commit Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructuring
- `test` - Adding tests
- `docs` - Documentation
- `chore` - Maintenance

**Examples:**
```bash
# Project changes
cd muh5
git add packages/server/src/services/combat.service.ts
git commit -m "feat(combat): implement damage calculation"

git add packages/server/src/services/__tests__/combat.service.test.ts
git commit -m "test(combat): add damage calculation tests"

git add packages/client/src/scenes/GameWorld.ts
git commit -m "feat(ui): add combat damage numbers display"
```

---

## Decision Matrix

| Change Type | Repository | Working Directory | Example |
|-------------|------------|-------------------|---------|
| Agent configuration | `.kiro/` | `.kiro/` | Update agent weights |
| Hook modification | `.kiro/` | `.kiro/` | Fix quality gate hook |
| Decision logging | `.kiro/` | `.kiro/` | Log team decision |
| Team report | `.kiro/` | `.kiro/` | Phase completion report |
| Steering file | `.kiro/` | `.kiro/` | Add new guidelines |
| Game feature | `muh5/` | `muh5/` | Implement combat system |
| Game bug fix | `muh5/` | `muh5/` | Fix movement validation |
| Game test | `muh5/` | `muh5/` | Add property tests |
| Game docs | `muh5/` | `muh5/` | Update API documentation |

---

## Common Scenarios

### Scenario 1: Implementing a Game Feature

**Task:** Implement combat system

**Steps:**
1. Team consultation (if needed) → Log to `.kiro/memory/decisions/`
2. Implement code → Commit to `muh5/`
3. Write tests → Commit to `muh5/`
4. Quality gate check → Log to `.kiro/memory/`
5. Update team metrics → Commit to `.kiro/`

**Git Commands:**
```bash
# Step 1: Log decision (team dev)
cd .kiro
git add memory/decisions/dec-2026-03-03-combat.json
git commit -m "feat: log combat system architecture decision"

# Step 2-3: Implement and test (project)
cd ../muh5
git add packages/server/src/services/combat.service.ts
git add packages/server/src/services/__tests__/combat.service.test.ts
git commit -m "feat(combat): implement damage calculation with tests"

# Step 4-5: Log quality gate and metrics (team dev)
cd ../.kiro
git add memory/metrics/2026-03.json
git add reports/quality-gate-combat-system.md
git commit -m "docs: quality gate passed for combat system"
```

---

### Scenario 2: Updating Team Infrastructure

**Task:** Update agent weights after weekly assessment

**Steps:**
1. Weekly assessment runs → Update weights
2. Generate report
3. Commit to `.kiro/`

**Git Commands:**
```bash
cd .kiro
git add memory/agent-weights.json
git add reports/weekly-assessment-2026-03-10.md
git commit -m "feat: update agent weights based on weekly assessment"
```

---

### Scenario 3: Bug Fix in Game Code

**Task:** Fix movement validation bug

**Steps:**
1. Identify bug → Log to `.kiro/memory/` (optional)
2. Fix code → Commit to `muh5/`
3. Add regression test → Commit to `muh5/`
4. Quality gate check → Log to `.kiro/` (optional)

**Git Commands:**
```bash
# Step 2-3: Fix and test (project)
cd muh5
git add packages/server/src/services/movement-validator.service.ts
git add packages/server/src/services/__tests__/movement-validator.service.test.ts
git commit -m "fix(movement): prevent teleportation exploit"
```

---

## CHANGELOG Management

### Team Dev CHANGELOG (`.kiro/CHANGELOG.md`)

**Purpose:** Track team infrastructure and autonomous operations changes

**Content:**
- Agent updates
- Hook modifications
- Skill improvements
- Steering file additions
- Memory system changes
- Team performance milestones

**Example:**
```markdown
# Changelog - AI Development Team

## [1.1.0] - 2026-03-10

### Added
- Weekly agent weight updates based on decision accuracy
- Git workflow steering file for dual repository management

### Changed
- Quality gate threshold increased to 8.0 for stricter standards

### Fixed
- Decision logging hook now handles concurrent decisions correctly
```

---

### Project CHANGELOG (`muh5/CHANGELOG.md`)

**Purpose:** Track game features, bug fixes, and improvements

**Content:**
- New game features
- Bug fixes
- Performance improvements
- Breaking changes
- Deprecations

**Example:**
```markdown
# Changelog - Mu Đại Thiên Sứ H5 Game

## [0.3.0] - 2026-03-10

### Added
- Combat system with damage calculation
- Experience and leveling system
- Combat validation with anti-cheat

### Fixed
- Movement validation now prevents teleportation
- Character creation validates name uniqueness

### Changed
- Increased monster spawn rate in Lorencia
```

---

## Best Practices

### DO ✅

1. **Always check working directory before committing**
   ```bash
   pwd  # Verify you're in correct directory
   ```

2. **Use descriptive commit messages**
   ```bash
   # Good
   git commit -m "feat(combat): implement damage calculation with equipment bonuses"
   
   # Bad
   git commit -m "update files"
   ```

3. **Commit related changes together**
   ```bash
   # Good - related changes
   git add combat.service.ts combat.service.test.ts
   git commit -m "feat(combat): add damage calculation with tests"
   ```

4. **Update appropriate CHANGELOG**
   - Team changes → `.kiro/CHANGELOG.md`
   - Project changes → `muh5/CHANGELOG.md`

5. **Keep commits atomic**
   - One logical change per commit
   - Easy to review and revert if needed

---

### DON'T ❌

1. **Don't mix team and project changes in one commit**
   ```bash
   # Bad - mixing repositories
   git add .kiro/memory/decisions/dec-001.json
   git add muh5/packages/server/src/services/combat.service.ts
   git commit -m "add combat system"  # WRONG!
   ```

2. **Don't commit to wrong repository**
   ```bash
   # Bad - team change in project repo
   cd muh5
   git add ../.kiro/memory/decisions/dec-001.json  # WRONG!
   ```

3. **Don't use vague commit messages**
   ```bash
   # Bad
   git commit -m "fix stuff"
   git commit -m "wip"
   git commit -m "update"
   ```

4. **Don't forget to update CHANGELOG**
   - Significant changes should be documented
   - Helps track project evolution

---

## Verification Checklist

Before committing, verify:

- [ ] I'm in the correct working directory (`.kiro/` or `muh5/`)
- [ ] Changes belong to this repository
- [ ] Commit message follows conventions
- [ ] Related changes are included
- [ ] CHANGELOG updated if needed
- [ ] No files from other repository included

---

## Quick Reference

### Team Dev Repository (`.kiro/`)

**Location:** `.kiro/`  
**Purpose:** AI team infrastructure and operations  
**Commit to:** `.kiro/.git/`  
**CHANGELOG:** `.kiro/CHANGELOG.md`

**Common files:**
- `agents/*.json`
- `hooks/*.kiro.hook`
- `memory/**/*.json`
- `reports/*.md`
- `steering/*.md`

---

### Project Repository (`muh5/`)

**Location:** `muh5/`  
**Purpose:** Game code and features  
**Commit to:** `muh5/.git/`  
**CHANGELOG:** `muh5/CHANGELOG.md`

**Common files:**
- `packages/client/src/**/*.ts`
- `packages/server/src/**/*.ts`
- `packages/**/tests/**/*.test.ts`
- `package.json`, `tsconfig.json`

---

## Summary

**Remember:**
1. **Two repositories** - Keep them separate
2. **Team changes** → `.kiro/` git
3. **Project changes** → `muh5/` git
4. **Check directory** before committing
5. **Update correct CHANGELOG**

**This ensures:**
- Clean git history
- Easy to track changes
- No confusion between team and project
- Proper version control for both

---

**Last Updated:** March 3, 2026  
**Version:** 1.0.0  
**Status:** ✅ ACTIVE
