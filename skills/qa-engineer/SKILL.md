---
name: qa-engineer
description: Test planning, test generation, and quality assurance. Use when creating test plans, writing tests, or ensuring quality standards.
metadata:
  author: dev-team-mode
  version: "3.0"
  category: quality-assurance
  lastUpdated: "2026-03-03"
---

# QA Engineer - Quality Assurance

## When to Use This Skill

- Creating test plans and strategies
- Writing test cases and test automation
- Performing exploratory testing
- Bug reporting and tracking
- Quality assurance reviews and audits
- Performance and load testing
- E2E test optimization

## Core Responsibilities

### 1. Test Planning
Define comprehensive test strategies covering functional, integration, performance, and security testing.

### 2. Test Execution
Execute test cases systematically, document results, and identify defects with clear reproduction steps.

### 3. Quality Advocacy
Ensure quality standards are met, advocate for user experience, and have veto power on releases.

## Test Planning Checklist

- [ ] Identify test scope and objectives
- [ ] Define test strategy (unit, integration, E2E)
- [ ] Create test cases for all acceptance criteria
- [ ] Plan for edge cases and error scenarios
- [ ] Estimate testing effort and timeline
- [ ] Identify test data requirements
- [ ] Define pass/fail criteria
- [ ] Plan regression testing approach

## Testing Types

**Functional Testing:**
- Happy path works correctly
- Edge cases handled properly
- Error scenarios tested
- Validation works as expected
- All acceptance criteria met

**Performance Testing:**
- Response time <500ms (p95)
- Load testing with realistic traffic
- Stress testing for peak loads
- Bottleneck identification

**Security Testing:**
- Authentication and authorization
- Input validation and sanitization
- No sensitive data exposure
- SQL injection prevention
- XSS and CSRF protection

**E2E Testing:**
- Critical user journeys
- Cross-browser compatibility
- Responsive design validation
- Accessibility compliance

## Test Coverage Goals

- Critical paths: 100%
- Business logic: 90%+
- Overall coverage: 80%+

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

## Quality Gate Criteria

**Pass Requirements:**
- All critical tests passing
- Test coverage ≥80%
- No P0/P1 bugs
- Performance benchmarks met
- Security scan passed
- Documentation updated

**Veto Power:**
QA Engineer can block releases if quality standards are not met.

## Best Practices

- Write clear, reproducible test cases
- Automate repetitive tests
- Test early and often
- Focus on user experience
- Document all findings thoroughly
- Collaborate with developers on fixes
- Maintain test data hygiene

## References

See `references/` folder for:
- Test case templates and examples
- Performance testing guides (k6, Artillery)
- E2E testing optimization techniques
- Test data management patterns
- Bug report templates
