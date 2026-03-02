---
name: qa-engineer
description: Test planning, test generation, and quality assurance. Use when creating test plans, writing tests, or ensuring quality standards.
metadata:
  author: mu-dai-thien-su-team
  version: "1.0"
  category: quality-assurance
---

# QA Engineer Workflow

## When to Use This Skill

- Creating test plans and strategies
- Writing test cases
- Performing exploratory testing
- Bug reporting and tracking
- Quality assurance reviews
- Test automation

## Core Responsibilities

### 1. Test Planning
Define comprehensive test strategies covering functional, integration, performance, and security testing.

### 2. Test Execution
Execute test cases systematically, document results, and identify defects.

### 3. Quality Advocacy
Ensure quality standards are met and advocate for user experience.

## Test Planning Checklist

- [ ] Identify test scope and objectives
- [ ] Define test strategy (unit, integration, E2E)
- [ ] Create test cases for all acceptance criteria
- [ ] Plan for edge cases and error scenarios
- [ ] Estimate testing effort
- [ ] Identify test data requirements
- [ ] Define pass/fail criteria
- [ ] Plan regression testing

## Test Case Template

```markdown
## Test Case: TC-[ID] - [Title]

**Feature:** [Feature name]
**Priority:** [Critical/High/Medium/Low]
**Type:** [Functional/Integration/E2E]

**Preconditions:**
- [Setup required]

**Test Steps:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Expected Result:**
[What should happen]

**Status:** [Pass/Fail/Blocked]
```

## Bug Report Template

```markdown
## Bug: [BUG-ID] - [Title]

**Severity:** [Critical/High/Medium/Low]
**Priority:** [P0/P1/P2/P3]
**Environment:** [Browser/OS/Version]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Impact:**
- Users affected: [Number/Percentage]
- Business impact: [Description]
```

## Testing Types

### Functional Testing
- [ ] Happy path works
- [ ] Edge cases handled
- [ ] Error scenarios tested
- [ ] Validation works
- [ ] All acceptance criteria met

### UI/UX Testing
- [ ] Responsive design
- [ ] Cross-browser compatibility
- [ ] Accessibility (WCAG)
- [ ] Loading states
- [ ] Error messages clear

### Integration Testing
- [ ] API integration works
- [ ] Database operations correct
- [ ] Third-party services integrated
- [ ] Data flow correct

### Performance Testing
- [ ] Page load time acceptable
- [ ] API response time good
- [ ] No memory leaks
- [ ] Handles concurrent users

### Security Testing
- [ ] Authentication works
- [ ] Authorization enforced
- [ ] Input validation
- [ ] No sensitive data exposed

## Test Coverage Goals

- Critical paths: 100%
- Business logic: 90%+
- Overall: 80%+

## References

See `references/` folder for:
- Test case examples
- Bug report templates
- Testing checklists
