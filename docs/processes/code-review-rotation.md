# Code Review Rotation System
## Developer-Led Review Process

**Created:** March 3, 2026  
**Owner:** Developer  
**Status:** ✅ Active

---

## Review Assignment Matrix

### Primary Reviewers

| Change Type | Primary Reviewer | Backup Reviewer | SLA |
|-------------|------------------|-----------------|-----|
| Feature implementation | Developer | Tech Lead | <2h |
| Bug fixes | Developer | Tech Lead | <2h |
| Refactoring (non-architecture) | Developer | Tech Lead | <2h |
| UI/UX changes | Developer | QA Engineer | <2h |
| Test additions | QA Engineer | Developer | <2h |
| Documentation | Developer | QA Engineer | <1h |
| **Architecture changes** | **Tech Lead** | - | <4h |
| **Database schema** | **Tech Lead** | - | <4h |
| **API contracts** | **Tech Lead** | - | <4h |
| **Security-critical** | **Tech Lead** | - | <4h |
| **Infrastructure** | **Tech Lead** | - | <4h |

---

## Architecture vs Non-Architecture

### Non-Architecture (Developer Reviews)
- Adding new features within existing architecture
- Bug fixes
- Refactoring within a module
- UI/UX improvements
- Adding tests
- Documentation updates
- Minor dependency updates (patch/minor versions)

### Architecture (Tech Lead Reviews)
- Changing system structure
- Adding new layers or modules
- Modifying API contracts
- Database schema changes
- Changing authentication/authorization
- Performance-critical changes
- Major dependency updates
- Infrastructure changes

### When in Doubt
- Tag both reviewers
- Err on the side of Tech Lead review
- Better safe than sorry

---

## Review Process

### 1. PR Created
- Author assigns reviewer based on matrix
- Author adds labels: `feature`, `bugfix`, `architecture`, etc.
- Author self-reviews first

### 2. Reviewer Notified
- Acknowledge within SLA
- Quick scan for priority
- Schedule detailed review

### 3. Review Conducted
- Follow [Code Review Guidelines](.kiro/docs/improvement-plan/code-review-guidelines.md)
- Leave constructive feedback
- Distinguish "must fix" vs "nice to have"

### 4. Feedback Addressed
- Author makes changes
- Re-request review
- Iterate until approved

### 5. Approved & Merged
- Reviewer approves
- Author merges (squash commits)
- Monitor deployment

---

## Review Tracking

### Metrics to Track
- Number of PRs reviewed per week
- Average review time
- Number of issues caught
- Number of escalations to Tech Lead

### Weekly Report
- Developer reports metrics in team meeting
- Identify bottlenecks
- Adjust process if needed

---

## Communication

### PR Description Template
```markdown
## What
Brief description of changes

## Why
Reason for changes

## How
Implementation approach

## Testing
How was this tested?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Self-reviewed
- [ ] No breaking changes (or documented)

## Review Type
- [ ] Non-architecture (Developer review)
- [ ] Architecture (Tech Lead review)
- [ ] Unsure (tag both)
```

### Review Comment Template
```markdown
**Issue:** [Describe problem]
**Why:** [Explain why it's a problem]
**Suggestion:** [Propose solution]
**Priority:** Must Fix / Should Fix / Nice to Have
```

---

## Escalation Process

### When to Escalate to Tech Lead
1. Architecture implications unclear
2. Security concerns beyond expertise
3. Performance impact uncertain
4. Breaking changes
5. Major refactoring

### How to Escalate
1. Add comment: "@tech-lead Please review - [reason]"
2. Tag Tech Lead as additional reviewer
3. Explain specific concerns
4. Continue with non-architecture review

---

## Success Metrics

### Week 1 Target
- Developer reviews 50% of non-architecture PRs
- Average review time <2 hours
- Tech Lead workload reduced by 10%

### Week 4 Target
- Developer reviews 80% of non-architecture PRs
- Average review time <2 hours
- Tech Lead workload reduced by 20%

---

## Current Status

**Week 1 (March 3-9, 2026):**
- [x] Review rotation system documented
- [x] Code review guidelines created
- [ ] First PR reviewed by Developer
- [ ] Metrics tracking started

**Immediate Actions:**
- Check for open PRs
- Review any non-architecture PRs
- Start tracking metrics

---

**Last Updated:** March 3, 2026  
**Next Review:** March 10, 2026
