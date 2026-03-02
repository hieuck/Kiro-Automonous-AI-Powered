# Team Discussion Workflow

**Version:** 1.0.0  
**Last Updated:** 2026-03-02

---

## Overview

Dev Team Mode có 3 cấp độ automation cho team discussions, tùy theo context và workflow của bạn.

---

## Layer 1: Spec-Based Workflow (Fully Automatic)

**Khi nào:** Khi làm việc với spec files (`.kiro/specs/*/tasks.md`)

**Cách hoạt động:**
1. Bạn tạo spec với tasks
2. Khi task status → `in_progress`, hook `auto-team-discussion.kiro.hook` tự động trigger
3. Team tự động thảo luận (Product Owner, Tech Lead, QA, DevOps)
4. Consensus được tính tự động
5. Decision được log vào `.kiro/memory/decisions/`
6. Implementation proceeds nếu consensus ≥80%

**Hook:** `auto-team-discussion.kiro.hook` (preTaskExecution)

**Automation Level:** 100% - Không cần user intervention

---

## Layer 2: Manual Trigger (On-Demand)

**Khi nào:** Khi cần team discussion cho ad-hoc decisions (không có spec)

**Cách hoạt động:**
1. Bạn explicitly request: "Discuss with team: [decision]"
2. Main agent invoke `team-coordinator` sub-agent
3. Team Coordinator orchestrates discussion
4. Decision được documented

**Hook:** `parallel-team-consultation.kiro.hook` (userTriggered)

**Example Commands:**
```
"Discuss with team: Should we use Redis or Memcached?"
"Team discussion: Architecture for real-time notifications"
```

**Automation Level:** 90% - Chỉ cần trigger command

---

## Layer 3: Smart Detection (Intelligent)

**Khi nào:** Main agent tự detect khi cần team input

**Cách hoạt động:**
1. Bạn request: "Implement combat system"
2. Main agent analyze complexity → invoke team-coordinator nếu cần
3. Team discussion tự động
4. Decision documented
5. Implementation proceeds

**Triggers For:**
- Architecture decisions
- Complex features
- Security-critical changes
- Performance optimization

**Automation Level:** 95% - Fully autonomous

---

## Decision Log Format

Documented in `.kiro/memory/decisions/`:

```markdown
# Decision Log: [Title]
**Date:** YYYY-MM-DD
**Consensus:** [%]
**Status:** APPROVED/REJECTED

## Context
## Options
## Team Consultation
## Final Decision
## Next Steps
```

---

## Consensus Calculation

```
Score = (Weighted Approval × 0.6) + (Avg Confidence × 0.4)
≥80%: Auto-approve
<80%: Escalate
```

**Weights:** Tech Lead (2.5x), QA (2.5x), DevOps (2.5x), PO (2x), Dev (1.5x)

---

## Best Practices

**DO:**
- Use spec workflow for planned features
- Request team discussion for important decisions
- Trust smart detection for complex tasks

**DON'T:**
- Request discussion for trivial changes
- Skip discussion for architecture decisions

---

**Status:** ✅ Production Ready  
**Automation Level:** 95%
