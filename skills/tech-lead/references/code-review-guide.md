# Comprehensive Code Review Guide

## Code Review Philosophy

Code review is not about finding faults—it's about:
- Sharing knowledge
- Maintaining quality
- Preventing bugs
- Improving design
- Building team culture

## Review Checklist

### Architecture & Design (Weight: 25%)

- [ ] **Separation of Concerns:** Each module has single responsibility
- [ ] **Design Patterns:** Appropriate patterns used correctly
- [ ] **Scalability:** Design supports growth
- [ ] **Maintainability:** Easy to understand and modify
- [ ] **Dependencies:** Minimal coupling, clear interfaces
- [ ] **Abstraction Level:** Appropriate for the problem
- [ ] **SOLID Principles:** Followed where applicable

### Code Quality (Weight: 30%)

- [ ] **Readability:** Code is self-documenting
- [ ] **Naming:** Variables, functions, classes named clearly
- [ ] **Function Size:** Functions < 50 lines
- [ ] **File Size:** Files < 300 lines
- [ ] **Complexity:** Cyclomatic complexity < 10
- [ ] **DRY:** No code duplication
- [ ] **Comments:** Complex logic explained
- [ ] **Formatting:** Consistent style

### Security (Weight: 20%)

- [ ] **Input Validation:** All user input validated
- [ ] **SQL Injection:** Parameterized queries used
- [ ] **XSS Prevention:** Output properly escaped
- [ ] **Authentication:** Properly implemented
- [ ] **Authorization:** Access control enforced
- [ ] **Secrets:** No hardcoded credentials
- [ ] **Dependencies:** No known vulnerabilities
- [ ] **Error Messages:** Don't leak sensitive info

### Performance (Weight: 15%)

- [ ] **Database Queries:** Optimized, indexed
- [ ] **N+1 Queries:** Avoided
- [ ] **Caching:** Used where appropriate
- [ ] **Algorithms:** Efficient complexity
- [ ] **Memory:** No leaks, proper cleanup
- [ ] **Network:** Minimized requests
- [ ] **Lazy Loading:** Used for heavy resources

### Testing (Weight: 10%)

- [ ] **Unit Tests:** Present and meaningful
- [ ] **Coverage:** ≥80% for new code
- [ ] **Edge Cases:** Covered
- [ ] **Integration Tests:** For critical paths
- [ ] **Test Quality:** Tests are maintainable
- [ ] **Mocking:** Used appropriately
- [ ] **Test Names:** Descriptive

## Review Comment Templates

### Blocking Issues (Must Fix)

```markdown
🚫 BLOCKING: SQL Injection Vulnerability

**Problem:** User input directly concatenated into SQL query on line 45
**Impact:** Attackers can execute arbitrary SQL commands, access/modify data
**Solution:** Use parameterized queries or ORM

Example:
\`\`\`typescript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Safe
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
\`\`\`

**Priority:** P0 - Must fix before merge
```

### Suggestions (Should Consider)

```markdown
💡 SUGGESTION: Extract duplicate validation logic

**Current:** Same email validation repeated in 3 places (lines 23, 67, 102)
**Proposed:** Create `validateEmail()` utility function
**Benefit:** 
- DRY principle
- Easier to maintain
- Consistent validation
- Easier to test

**Priority:** P2 - Improve code quality
```

### Questions (Need Clarification)

```markdown
❓ QUESTION: Why async here?

**Context:** Function `calculateTotal()` on line 89 is marked async
**Question:** I don't see any await statements. Is this intentional?
**Suggestion:** Remove async if not needed, or add comment explaining why

**Priority:** P3 - Clarification needed
```

### Praise (Positive Feedback)

```markdown
✨ NICE: Excellent error handling

Great job implementing comprehensive error handling with specific error types and helpful messages. This will make debugging much easier!
```

## Review Process

### 1. First Pass (5-10 minutes)
- Read PR description
- Understand the goal
- Check if approach makes sense
- Identify major issues

### 2. Detailed Review (20-30 minutes)
- Go through code line by line
- Check against checklist
- Leave inline comments
- Note patterns (good and bad)

### 3. Summary (5 minutes)
- Summarize findings
- Prioritize issues (P0, P1, P2, P3)
- Provide overall assessment
- Suggest next steps

## Priority Levels

**P0 (Critical - Must Fix):**
- Security vulnerabilities
- Data loss risks
- Breaking changes
- Critical bugs

**P1 (High - Should Fix):**
- Performance issues
- Poor error handling
- Missing tests
- Significant code smells

**P2 (Medium - Consider Fixing):**
- Code duplication
- Minor refactoring opportunities
- Documentation improvements
- Style inconsistencies

**P3 (Low - Nice to Have):**
- Naming suggestions
- Minor optimizations
- Questions/clarifications
- Future improvements

## Review Outcomes

### ✅ Approve
- All P0 and P1 issues resolved
- Code meets quality standards
- Tests passing
- Ready to merge

### ⚠️ Approve with Comments
- Minor P2/P3 issues remain
- Can be addressed in follow-up
- Not blocking merge
- Create follow-up tasks

### 🔄 Request Changes
- P0 or P1 issues present
- Must be fixed before merge
- Clear action items provided
- Re-review needed

### ❌ Reject
- Fundamental design issues
- Wrong approach
- Needs complete rework
- Discuss alternative approach

## Best Practices

### For Reviewers

**Do:**
- ✅ Review promptly (within 24 hours)
- ✅ Be constructive and specific
- ✅ Explain the "why" not just "what"
- ✅ Provide examples and resources
- ✅ Praise good work
- ✅ Ask questions to understand
- ✅ Focus on important issues

**Don't:**
- ❌ Be overly critical or harsh
- ❌ Nitpick minor style issues
- ❌ Block on personal preferences
- ❌ Review when tired or rushed
- ❌ Assume malicious intent
- ❌ Make it personal

### For Authors

**Do:**
- ✅ Self-review before requesting
- ✅ Provide context in PR description
- ✅ Keep PRs small (<400 lines)
- ✅ Respond to all comments
- ✅ Ask for clarification if needed
- ✅ Thank reviewers

**Don't:**
- ❌ Take feedback personally
- ❌ Argue defensively
- ❌ Ignore comments
- ❌ Submit without testing
- ❌ Rush the review process

## Common Code Smells

### Long Method
**Smell:** Function > 50 lines
**Fix:** Extract smaller functions

### Large Class
**Smell:** Class > 300 lines
**Fix:** Split into multiple classes

### Duplicate Code
**Smell:** Same code in multiple places
**Fix:** Extract to shared function

### Long Parameter List
**Smell:** Function with >4 parameters
**Fix:** Use object parameter or builder pattern

### Feature Envy
**Smell:** Method uses another class's data more than its own
**Fix:** Move method to the other class

### Data Clumps
**Smell:** Same group of data items together
**Fix:** Create a class for the group

## Tools and Automation

### Static Analysis
- ESLint / TSLint
- SonarQube
- CodeClimate
- Prettier

### Security Scanning
- npm audit
- Snyk
- OWASP Dependency Check
- GitHub Security Alerts

### Test Coverage
- Jest coverage reports
- Codecov
- Coveralls

### Performance
- Lighthouse
- WebPageTest
- Chrome DevTools

## Review Metrics

Track these to improve process:
- Average review time
- Number of review rounds
- Issues found per review
- Review thoroughness score
- Author satisfaction
- Reviewer workload

## Continuous Improvement

### Weekly
- Review metrics
- Identify bottlenecks
- Share learnings

### Monthly
- Update checklist
- Refine process
- Team retrospective

### Quarterly
- Major process changes
- Tool evaluation
- Training needs
