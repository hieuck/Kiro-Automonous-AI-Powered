---
name: tech-lead
description: Technical architecture, code review, and technical decision-making. Use when reviewing PRs, designing systems, or making technical choices.
metadata:
  author: mu-dai-thien-su-team
  version: "1.0"
  category: leadership
---

# Tech Lead Workflow

## When to Use This Skill

- Reviewing pull requests
- Designing system architecture
- Making technology choices
- Technical planning and estimation
- Mentoring developers
- Identifying technical risks

## Core Responsibilities

### 1. Technical Architecture
Design scalable, maintainable systems that follow established patterns and best practices.

### 2. Code Review
Ensure code quality, security, and performance through thorough reviews.

### 3. Technical Leadership
Guide team on technical decisions, mentor developers, and enforce standards.

## Code Review Checklist

### Architecture & Design
- [ ] Follows established patterns
- [ ] Proper separation of concerns
- [ ] No unnecessary complexity
- [ ] Scalable design
- [ ] Appropriate design patterns
- [ ] Clear module boundaries
- [ ] Dependency management

### Code Quality
- [ ] Clean and readable
- [ ] Follows naming conventions
- [ ] No code duplication (DRY)
- [ ] Proper error handling
- [ ] Functions under 50 lines
- [ ] Files under 300 lines
- [ ] Maximum 3 levels of nesting
- [ ] Single Responsibility Principle

### Security
- [ ] Input validation
- [ ] No SQL injection vulnerabilities
- [ ] Proper authentication/authorization
- [ ] No sensitive data exposure
- [ ] Secrets in environment variables
- [ ] HTTPS enforced
- [ ] XSS protection
- [ ] CSRF protection

### Performance
- [ ] Optimized database queries
- [ ] Proper indexing
- [ ] Caching strategy
- [ ] No N+1 queries
- [ ] Lazy loading where appropriate
- [ ] Pagination for large datasets
- [ ] Resource cleanup

### Testing
- [ ] Adequate test coverage (80%+)
- [ ] Tests are meaningful
- [ ] Edge cases covered
- [ ] Integration tests for critical paths
- [ ] Tests follow AAA pattern
- [ ] No flaky tests
- [ ] Fast test execution

### Documentation
- [ ] Code comments for complex logic
- [ ] JSDoc for public APIs
- [ ] README updated
- [ ] API documentation
- [ ] Architecture decisions documented

## Review Comment Templates

### Blocking Issues
```
🚫 BLOCKING: [Issue description]

Problem: [What's wrong]
Impact: [Why it matters]
Solution: [How to fix]

Example:
🚫 BLOCKING: SQL Injection Vulnerability

Problem: User input is directly concatenated into SQL query
Impact: Attackers can execute arbitrary SQL commands
Solution: Use parameterized queries or ORM
```

### Suggestions
```
💡 SUGGESTION: [Improvement idea]

Current: [What's there now]
Proposed: [Better approach]
Benefit: [Why it's better]

Example:
💡 SUGGESTION: Extract duplicate logic

Current: Same validation logic repeated in 3 places
Proposed: Create validateUserInput() utility function
Benefit: DRY principle, easier to maintain and test
```

### Questions
```
❓ QUESTION: [Clarification needed]

Context: [Background]
Question: [What you want to know]

Example:
❓ QUESTION: Why async here?

Context: This function doesn't seem to do any async operations
Question: Is there a reason for making this async?
```

## Architecture Decision Framework

### 1. Understand Requirements
- Business goals
- Technical constraints
- Performance requirements
- Security requirements
- Scalability needs

### 2. Evaluate Options
- List alternatives
- Pros and cons for each
- Trade-offs analysis
- Cost implications

### 3. Make Decision
- Document rationale
- Consider team expertise
- Future maintainability
- Migration path

### 4. Communicate
- Share with team
- Document in ADR (Architecture Decision Record)
- Update architecture diagrams

## Technical Debt Management

### Identify Technical Debt
- Code smells
- Outdated dependencies
- Missing tests
- Poor documentation
- Performance bottlenecks

### Prioritize
- Impact on development velocity
- Risk to system stability
- Cost to fix
- Business value

### Plan Refactoring
- Break into small tasks
- Schedule in sprints
- Balance with features
- Track progress

## Technology Evaluation Criteria

### Must Have
- Meets requirements
- Active community
- Good documentation
- Security track record
- License compatibility

### Nice to Have
- Team familiarity
- Performance benchmarks
- Ecosystem maturity
- Migration tools
- Support options

## Mentoring Guidelines

### Code Review as Teaching
- Explain the "why" not just "what"
- Share resources and examples
- Encourage questions
- Be constructive and supportive

### Knowledge Sharing
- Tech talks
- Pair programming
- Documentation
- Code examples
- Best practices guides

## Technical Planning

### Task Breakdown
- Identify dependencies
- Estimate complexity (T-shirt sizes)
- Consider risks
- Plan for testing
- Documentation needs

### Risk Assessment
- Technical risks
- Dependency risks
- Performance risks
- Security risks
- Mitigation strategies

## References

See `references/` folder for:
- Architecture patterns
- Code review examples
- ADR templates
- Technical debt tracking
