# Decision Log: Combat System Architecture

**Date:** 2026-03-02  
**Decision ID:** ARCH-001  
**Status:** ✅ APPROVED (Consensus: 94%)  
**Category:** Architecture

---

## Context

Cần quyết định kiến trúc cho hệ thống combat real-time của game Mu Đại Thiên Sứ H5.

**Requirements:**
- 1000+ concurrent players per server
- Real-time combat: skill casting, damage calculation, position updates
- Target: 60 ticks/second
- Current stack: Node.js, WebSocket, PostgreSQL, Redis

---

## Options Evaluated

### Option 1: Event-Driven với Redis Pub/Sub
- ✅ Scalable, dễ thêm servers
- ✅ Decoupled architecture
- ❌ Network overhead
- ❌ Potential message loss

### Option 2: In-Memory Game Loop với Spatial Partitioning
- ✅ Predictable performance
- ✅ No network latency
- ❌ Limited to single server
- ❌ Khó scale horizontally

### Option 3: Hybrid (In-Memory + Redis)
- ✅ Best of both worlds
- ✅ Optimized for common case (same-zone combat)
- ✅ Scalable for cross-zone interactions
- ❌ More complex implementation

---

## Team Consultation

### Tech Lead (Weight: 2.5x - Architecture Decision)
**Opinion:** Recommend Option 3 (Hybrid)

**Reasoning:**
- In-memory loop cho same-zone combat đảm bảo performance (60 FPS stable)
- Redis pub/sub chỉ dùng cho cross-zone → giảm 90% network overhead
- Spatial partitioning giúp optimize collision detection
- Complexity tăng nhưng có thể manage được với proper abstraction

**Confidence:** 90%  
**Vote:** ✅ APPROVE Option 3

---

### Senior Developer (Weight: 1.5x)
**Opinion:** Prefer Option 3, có concerns về implementation

**Reasoning:**
- Option 2 quá đơn giản, sẽ gặp bottleneck khi scale
- Option 1 có latency issues cho combat real-time
- Option 3 là compromise tốt nhất
- Cần design pattern rõ ràng để tách biệt in-memory vs cross-zone logic

**Concerns:**
- Testing sẽ phức tạp hơn (cần mock Redis)
- Debugging cross-zone issues khó hơn

**Confidence:** 85%  
**Vote:** ✅ APPROVE Option 3 (with concerns)

---

### QA Engineer (Weight: 2.5x - Quality Impact)
**Opinion:** Support Option 3 với điều kiện có test strategy

**Reasoning:**
- Option 3 cần comprehensive test coverage:
  - Unit tests cho game loop logic
  - Integration tests cho Redis pub/sub
  - Load tests cho 1000+ concurrent players
  - Chaos testing cho network failures
- Cần monitoring và alerting cho cả 2 paths (in-memory + Redis)

**Requirements:**
- Test coverage ≥ 80%
- Performance benchmarks documented
- Rollback plan nếu có issues

**Confidence:** 80%  
**Vote:** ✅ APPROVE Option 3 (conditional)

---

### DevOps Engineer (Weight: 2.5x - Deployment Impact)
**Opinion:** Option 3 is deployable, cần infrastructure prep

**Reasoning:**
- Redis cluster cần setup cho high availability
- Monitoring: game loop FPS, Redis pub/sub latency, cross-zone message rate
- Deployment strategy: canary release (10% → 50% → 100%)
- Resource planning: 
  - CPU: game loop cần dedicated cores
  - Memory: spatial grid + player states
  - Network: Redis bandwidth estimation

**Infrastructure Needs:**
- Redis Cluster (3 nodes minimum)
- Prometheus + Grafana for metrics
- Load balancer với sticky sessions

**Confidence:** 85%  
**Vote:** ✅ APPROVE Option 3

---

## Consensus Calculation

**Weighted Approval Rate:**
- Tech Lead: APPROVE (weight: 2.5) ✅
- Developer: APPROVE (weight: 1.5) ✅
- QA: APPROVE (weight: 2.5) ✅
- DevOps: APPROVE (weight: 2.5) ✅

Total weight: 2.5 + 1.5 + 2.5 + 2.5 = 9.0  
Approval weight: 9.0 / 9.0 = 100%

**Average Confidence:**
(90 + 85 + 80 + 85) / 4 = 85%

**Consensus Score:**
(100% × 0.6) + (85% × 0.4) = 60% + 34% = 94%

**Result:** 94% ≥ 80% → ✅ AUTO-APPROVE

---

## Final Decision

**APPROVED: Option 3 - Hybrid Architecture (In-Memory + Redis)**

### Implementation Plan

**Phase 1: Core Game Loop (Week 1-2)**
- Implement single-threaded game loop (60 FPS)
- Spatial partitioning với grid-based collision detection
- Basic combat mechanics (skill casting, damage calculation)
- Unit tests + performance benchmarks

**Phase 2: Redis Integration (Week 3)**
- Setup Redis cluster
- Implement pub/sub for cross-zone events
- Message serialization/deserialization
- Integration tests

**Phase 3: Testing & Optimization (Week 4)**
- Load testing với 1000+ concurrent players
- Performance tuning
- Monitoring setup (Prometheus + Grafana)
- Documentation

**Phase 4: Deployment (Week 5)**
- Canary release: 10% traffic
- Monitor metrics: FPS, latency, error rate
- Gradual rollout: 50% → 100%

### Success Metrics

- ✅ Game loop maintains 60 FPS với 1000+ players
- ✅ Same-zone combat latency < 16ms (1 frame)
- ✅ Cross-zone message latency < 100ms
- ✅ Test coverage ≥ 80%
- ✅ Zero data loss during combat

### Risk Mitigation

**Risk 1: Game loop performance degradation**
- Mitigation: Spatial partitioning, object pooling, profiling
- Rollback: Reduce tick rate to 30 FPS temporarily

**Risk 2: Redis cluster failure**
- Mitigation: High availability setup (3 nodes), automatic failover
- Rollback: Disable cross-zone combat, same-zone only

**Risk 3: Complex debugging**
- Mitigation: Comprehensive logging, distributed tracing, replay system
- Rollback: Feature flags to disable hybrid mode

---

## Key Insights

1. **Performance First:** In-memory loop cho 90% cases (same-zone combat)
2. **Scalability When Needed:** Redis chỉ cho cross-zone (10% cases)
3. **Pragmatic Approach:** Không over-engineer, focus on common case
4. **Quality Gates:** Test coverage + monitoring là must-have
5. **Incremental Rollout:** Canary deployment giảm risk

---

## Next Steps

1. ✅ Decision approved - proceed with implementation
2. [ ] Tech Lead: Create detailed architecture diagram
3. [ ] Developer: Setup project structure + game loop skeleton
4. [ ] QA: Write test plan + test cases
5. [ ] DevOps: Provision Redis cluster + monitoring
6. [ ] All: Daily standup to track progress

---

## References

- Architecture Guidelines: `.kiro/steering/architecture-guidelines.md`
- Security Policies: `.kiro/steering/security-policies.md`
- Muh5 Server README: `muh5/packages/server/README.md`

---

**Decision Made By:** Team Coordinator (Natural Language Consensus)  
**Participants:** Tech Lead, Senior Developer, QA Engineer, DevOps Engineer  
**Automation Level:** 95% (auto-approved based on consensus ≥80%)
