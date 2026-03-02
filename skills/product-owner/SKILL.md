---
name: product-owner
description: Requirements analysis, user story writing, and backlog management. Use when defining features, writing user stories, or prioritizing work.
metadata:
  author: mu-dai-thien-su-team
  version: "1.0"
  category: product-management
---

# Product Owner Workflow

## When to Use This Skill

- Analyzing and defining requirements
- Writing user stories
- Managing product backlog
- Prioritizing features
- Defining acceptance criteria
- Sprint planning

## Core Responsibilities

### 1. Requirements Analysis
Understand stakeholder needs and translate them into clear, actionable requirements.

### 2. Backlog Management
Maintain a healthy, prioritized backlog that delivers maximum business value.

### 3. Stakeholder Communication
Bridge the gap between business needs and technical implementation.

## User Story Template

```markdown
## [STORY-ID] - [Story Title]

**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Business Value:** [High/Medium/Low]
**Priority:** [P0/P1/P2/P3]
**Story Points:** [1/2/3/5/8/13]

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]

**Technical Notes:**
- API changes needed: [Yes/No]
- Database changes: [Yes/No]
- Dependencies: [List]

**Definition of Done:**
- [ ] Code implemented and reviewed
- [ ] Tests written (80%+ coverage)
- [ ] Documentation updated
- [ ] Acceptance criteria verified
- [ ] Product Owner approval
```

## Prioritization Frameworks

### MoSCoW Method
- **Must Have:** Critical for release
- **Should Have:** Important but not critical
- **Could Have:** Nice to have
- **Won't Have:** Out of scope

### RICE Scoring
**Score = (Reach × Impact × Confidence) / Effort**

- **Reach:** Users affected per quarter
- **Impact:** 3=massive, 2=high, 1=medium, 0.5=low
- **Confidence:** 100%=high, 80%=medium, 50%=low
- **Effort:** Person-months required

## Backlog Grooming Checklist

- [ ] Stories are clear and understandable
- [ ] Acceptance criteria are testable
- [ ] Dependencies identified
- [ ] Stories properly sized
- [ ] Business value clear
- [ ] Priority assigned
- [ ] Backlog ordered by priority

## Acceptance Criteria Format

```
Given [initial context]
When [action occurs]
Then [expected outcome]

Example:
Given I'm logged in as admin
When I click "Delete User"
Then user is removed
And I see success message
```

## Definition of Ready

Story is ready when:
- [ ] User story is clear
- [ ] Acceptance criteria defined
- [ ] Dependencies identified
- [ ] Estimated by team
- [ ] Testable
- [ ] Small enough for one sprint

## Definition of Done

Story is done when:
- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Acceptance criteria met
- [ ] Product Owner approved

## References

See `references/` folder for:
- User story examples
- Prioritization templates
- Sprint planning guides
