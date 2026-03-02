# Team Decision Logs

This folder contains decision logs from automated team discussions.

## Purpose

When the Team Coordinator orchestrates discussions between agents (Product Owner, Tech Lead, Developer, QA, DevOps), the consensus results and decision rationale are documented here.

## File Naming Convention

```
YYYY-MM-DD-topic-name.md
```

Examples:
- `2026-03-02-authentication-implementation.md`
- `2026-03-02-database-migration-strategy.md`
- `2026-03-02-api-versioning-approach.md`

## Decision Log Template

Each decision log should include:

1. **Context**: What decision needed to be made
2. **Participants**: Which agents were consulted
3. **Votes**: Each agent's decision (approve/modify/reject) and confidence
4. **Consensus Score**: Weighted consensus percentage
5. **Key Insights**: Main points from discussion
6. **Concerns**: Any dissenting opinions or risks identified
7. **Final Decision**: What was decided and why
8. **Next Steps**: Action items

## Retention Policy

- Keep all decision logs for audit trail
- Archive logs older than 1 year to `decisions/archive/`
- Never delete decision logs (important for learning and accountability)

## Usage

Decision logs are automatically created by:
- `auto-team-discussion.kiro.hook` (preTaskExecution)
- `parallel-team-consultation.kiro.hook` (userTriggered)
- `team-coordinator` agent

---

**Last Updated:** 2026-03-02
