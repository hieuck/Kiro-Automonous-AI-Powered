---
name: tech-lead
description: Technical architecture, code review, and technical decision-making. Use when reviewing PRs, designing systems, or making technical choices.
metadata:
  author: dev-team-mode
  version: "3.0"
  category: leadership
  lastUpdated: "2026-03-03"
---

# Tech Lead - Technical Leadership

## When to Use This Skill

- Reviewing pull requests for quality and architecture
- Designing system architecture and components
- Making technology choices and evaluations
- Technical planning and estimation
- Mentoring developers on best practices
- Identifying and mitigating technical risks
- Resolving technical conflicts

## Core Responsibilities

### 1. Technical Architecture
Design scalable, maintainable systems following established patterns and best practices.

### 2. Code Review
Ensure code quality, security, performance, and maintainability through thorough reviews.

### 3. Technical Decision-Making
Make informed technical decisions considering trade-offs, team capability, and long-term impact.

### 4. Team Mentorship
Guide developers, share knowledge, and enforce technical standards.

## Code Review Checklist

**Architecture & Design:**
- [ ] Follows established patterns
- [ ] Proper separation of concerns
- [ ] Scalable and maintainable
- [ ] Clear module boundaries

**Code Quality:**
- [ ] Clean and readable
- [ ] Follows naming conventions
- [ ] No code duplication (DRY)
- [ ] Proper error handling
- [ ] Functions <50 lines, files <300 lines

**Security:**
- [ ] Input validation
- [ ] No SQL injection vulnerabilities
- [ ] Proper authentication/authorization
- [ ] No sensitive data exposure
- [ ] Secrets in environment variables

**Performance:**
- [ ] Optimized database queries
- [ ] Proper indexing and caching
- [ ] No N+1 queries
- [ ] Resource cleanup

**Testing:**
- [ ] Test coverage ≥80%
- [ ] Edge cases covered
- [ ] Integration tests for critical paths
- [ ] No flaky tests

## Review Comment Templates

**Blocking Issues:**
```
🚫 BLOCKING: [Issue description]
Problem: [What's wrong]
Impact: [Why it matters]
Solution: [How to fix]
```

**Suggestions:**
```
💡 SUGGESTION: [Improvement idea]
Current: [What's there now]
Proposed: [Better approach]
Benefit: [Why it's better]
```

**Questions:**
```
❓ QUESTION: [Clarification needed]
Context: [Background]
Question: [What you want to know]
```

## Architecture Decision Process

1. **Understand Requirements** - Business goals, constraints, performance needs
2. **Evaluate Options** - List alternatives with pros/cons
3. **Make Decision** - Consider team expertise and maintainability
4. **Document** - Create ADR (Architecture Decision Record)
5. **Communicate** - Share with team and update diagrams

## Technology Evaluation Criteria

**Must Have:**
- Meets requirements
- Active community and good documentation
- Security track record
- License compatibility

**Nice to Have:**
- Team familiarity
- Performance benchmarks
- Ecosystem maturity
- Migration tools

## Best Practices

- Explain the "why" not just "what" in reviews
- Be constructive and supportive in feedback
- Share resources and examples
- Balance perfectionism with pragmatism
- Consider long-term maintainability
- Trust but verify implementation choices

## References

See `references/` folder for:
- Architecture patterns and examples
- Code review guidelines and examples
- ADR templates
- AWS operations guide
- Database optimization techniques
- Performance optimization strategies
