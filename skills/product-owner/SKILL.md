---
name: feature-prioritization
description: Feature prioritization and product management for autonomous AI team. Covers RICE scoring, requirements definition, backlog management, stakeholder communication, and business value assessment. Use when prioritizing features, defining requirements, or making product decisions.
metadata:
  author: dev-team-mode
  version: "3.0"
  category: product-management
  lastUpdated: "2026-03-03"
---

# Product Owner - Feature Prioritization

## When to Use This Skill

- Prioritizing features and backlog items
- Defining requirements and acceptance criteria
- Assessing business value and ROI
- Managing stakeholder expectations
- Making product decisions and trade-offs
- Planning releases and roadmaps
- Validating feature completeness

## Core Responsibilities

### 1. Feature Prioritization
Use data-driven frameworks (RICE, MoSCoW) to prioritize features based on business value, user impact, and effort.

### 2. Requirements Definition
Write clear, testable requirements with acceptance criteria ensuring team understands what to build.

### 3. Stakeholder Management
Communicate with stakeholders, gather feedback, manage expectations, and align product decisions with business goals.

### 4. Backlog Management
Maintain organized, prioritized backlog with clear descriptions and up-to-date status.

## RICE Scoring Framework

**Formula:** `RICE Score = (Reach × Impact × Confidence) / Effort`

**Reach:** How many users affected per time period?
- 1000+ users/month = 1000
- 100-999 users/month = 500
- 10-99 users/month = 50
- <10 users/month = 10

**Impact:** How much will this impact users?
- Massive = 3
- High = 2
- Medium = 1
- Low = 0.5
- Minimal = 0.25

**Confidence:** How confident are we?
- High = 100%
- Medium = 80%
- Low = 50%

**Effort:** How much work required?
- Person-months (0.5, 1, 2, 4, etc.)

**Example:**
```
Feature: User authentication
Reach: 1000 users/month
Impact: 3 (Massive - security critical)
Confidence: 100% (High - clear requirements)
Effort: 2 person-months

RICE = (1000 × 3 × 1.0) / 2 = 1500
```

## Requirements Template

```markdown
## Feature: [Feature Name]

### Business Value
[Why we're building this, expected impact]

### User Story
As a [user type]
I want to [action]
So that [benefit]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Technical Considerations
[Any technical constraints or dependencies]

### Success Metrics
- Metric 1: [Target]
- Metric 2: [Target]

### Priority
[Critical/High/Medium/Low]

### Estimated Effort
[T-shirt size: XS/S/M/L/XL]
```

## MoSCoW Prioritization

**Must Have:** Critical for release, non-negotiable
**Should Have:** Important but not critical
**Could Have:** Nice to have if time permits
**Won't Have:** Out of scope for this release

## Backlog Management

**Backlog Structure:**
1. **Now** (Current sprint) - In progress
2. **Next** (Next sprint) - Ready to start
3. **Later** (Future) - Prioritized but not scheduled
4. **Someday** (Ideas) - Low priority, needs refinement

**Backlog Grooming:**
- Review weekly
- Refine requirements
- Update priorities
- Remove obsolete items
- Break down large items

## Stakeholder Communication

**Regular Updates:**
- Sprint reviews (demo completed features)
- Roadmap updates (quarterly)
- Status reports (weekly)
- Ad-hoc updates for critical changes

**Communication Style:**
- Clear and concise
- Focus on business value
- Transparent about trade-offs
- Data-driven decisions
- Manage expectations realistically

## Product Decision Framework

**When making product decisions, consider:**
1. **User Value** - Does this solve a real user problem?
2. **Business Value** - Does this align with business goals?
3. **Technical Feasibility** - Can we build this?
4. **Resource Availability** - Do we have capacity?
5. **Strategic Fit** - Does this fit our roadmap?
6. **Risk** - What are the risks and mitigation?

## Best Practices

- Prioritize ruthlessly based on data
- Write clear, testable acceptance criteria
- Involve team in estimation and planning
- Validate assumptions with users
- Communicate trade-offs transparently
- Keep backlog organized and up-to-date
- Focus on outcomes, not outputs
- Measure and iterate based on results

## References

See `references/` folder for:
- RICE scoring calculator
- Requirements templates
- User story examples
- Stakeholder communication templates
- Product roadmap examples
