# Code Review Guidelines
## Developer-Led Review Process

**Created:** March 3, 2026  
**Owner:** Developer  
**Purpose:** Enable Developer to review non-architecture PRs, reducing Tech Lead bottleneck

---

## Review Responsibility Matrix

### Developer Reviews (Primary)
- Feature implementations
- Bug fixes
- Refactoring (within existing architecture)
- UI/UX changes
- Test additions
- Documentation updates
- Dependency updates (minor/patch)

### Tech Lead Reviews (Primary)
- Architecture changes
- Database schema changes
- API contract changes
- Security-critical changes
- Infrastructure changes
- Major dependency updates
- Performance-critical changes

### When in Doubt
- Tag both reviewers
- Err on the side of Tech Lead review for anything touching core architecture

---

## Code Review Checklist

### Functionality ✅
- [ ] Code does what the PR description says
- [ ] Edge cases are handled
- [ ] Error handling is comprehensive
- [ ] No obvious bugs or logic errors

### Code Quality ✅
- [ ] Follows naming conventions (camelCase, PascalCase, etc.)
- [ ] No code duplication (DRY principle)
- [ ] Functions are small and focused (<50 lines)
- [ ] Files are reasonable size (<300 lines)
- [ ] Proper abstraction levels
- [ ] SOLID principles followed

### Testing ✅
- [ ] Unit tests included for new code
- [ ] Tests cover edge cases
- [ ] Tests are clear and maintainable
- [ ] Coverage doesn't decrease
- [ ] All tests pass locally

### Security ✅
- [ ] No sensitive data exposed (API keys, passwords)
- [ ] Input validation present
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] Authentication/authorization checks

### Performance ✅
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Appropriate caching used
- [ ] Large lists handled efficiently

### Documentation ✅
- [ ] Code comments for complex logic
- [ ] JSDoc/docstrings for public functions
- [ ] README updated if needed
- [ ] API docs updated if needed

### Style & Formatting ✅
- [ ] Linter passes
- [ ] Consistent with codebase style
- [ ] No unnecessary whitespace changes
- [ ] Proper indentation

---

## Review Process

### 1. Initial Review (Within 2 Hours)
- Acknowledge PR received
- Quick scan for obvious issues
- Assign priority (urgent, normal, low)

### 2. Detailed Review
- Run code locally if needed
- Check against checklist
- Leave inline comments for issues
- Suggest improvements

### 3. Feedback
- Be constructive and specific
- Explain the "why" behind suggestions
- Distinguish between "must fix" and "nice to have"
- Praise good code

### 4. Approval
- Approve when all "must fix" items addressed
- Request changes if significant issues remain
- Comment if just suggestions (no blocking)

### 5. Follow-up
- Verify changes after re-review
- Merge when approved
- Monitor deployment

---

## Review SLAs

| Priority | Initial Response | Detailed Review | Total Time |
|----------|------------------|-----------------|------------|
| Urgent | 30 minutes | 1 hour | 2 hours |
| Normal | 2 hours | 4 hours | 1 day |
| Low | 4 hours | 1 day | 2 days |

---

## Common Review Patterns

### Good Patterns ✅
```typescript
// Clear naming
function calculateUserDiscount(user: User, order: Order): number {
  // Implementation
}

// Proper error handling
try {
  await processPayment(order);
} catch (error) {
  logger.error('Payment failed', { orderId: order.id, error });
  throw new PaymentError('Payment processing failed');
}

// Parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

### Anti-Patterns ❌
```typescript
// Vague naming
function doStuff(x: any): any {
  // Implementation
}

// Silent failures
try {
  await processPayment(order);
} catch (error) {
  // Nothing - error swallowed!
}

// SQL injection risk
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

---

## Escalation to Tech Lead

### When to Escalate
- Architecture implications unclear
- Security concerns beyond your expertise
- Performance impact uncertain
- Database schema changes
- Breaking API changes
- Major refactoring across multiple modules

### How to Escalate
1. Add comment: "@tech-lead Please review - [reason]"
2. Tag Tech Lead as additional reviewer
3. Explain specific concerns
4. Continue with non-architecture review

---

## Review Comments Template

### Requesting Changes
```
**Issue:** [Describe the problem]
**Why:** [Explain why it's a problem]
**Suggestion:** [Propose a solution]
**Priority:** Must Fix / Should Fix / Nice to Have
```

### Approving with Suggestions
```
**LGTM!** Great work on [specific thing].

**Optional improvements:**
- [Suggestion 1]
- [Suggestion 2]

Feel free to merge as-is or incorporate suggestions.
```

### Escalating
```
**Looks good overall**, but I'd like @tech-lead to review the [specific area] 
because [reason - architecture/security/performance concern].

My review covers functionality, tests, and code quality ✅
```

---

## Learning & Improvement

### Shadow Tech Lead Reviews
- Read Tech Lead's review comments
- Understand reasoning behind architecture decisions
- Ask questions when unclear
- Build pattern recognition

### Weekly Review Retrospective
- What went well?
- What was challenging?
- What did I learn?
- What patterns emerged?

### Feedback Loop
- Ask Tech Lead for feedback on your reviews
- Identify areas for improvement
- Gradually expand review scope

---

## Metrics to Track

- Number of PRs reviewed per week
- Average review time
- Number of issues caught
- Number of escalations to Tech Lead
- Reviewer confidence level

**Target:** Review 80% of non-architecture PRs within SLA

---

## Resources

- [Dev Team Standards](.kiro/steering/dev-team-standards.md)
- [Architecture Guidelines](.kiro/steering/architecture-guidelines.md)
- [Security Policies](.kiro/steering/security-policies.md)
- [Infrastructure Runbook](.kiro/steering/infrastructure-runbook.md)

---

**Last Updated:** March 3, 2026  
**Next Review:** March 17, 2026
