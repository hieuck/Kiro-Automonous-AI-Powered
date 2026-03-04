# ADR-001: Auto-Hunt System Architecture

**Date:** 2026-03-04  
**Status:** ✅ Accepted  
**Deciders:** Tech Lead, QA Engineer, Product Owner, Developer  
**Complexity:** 6/10  
**Consensus:** 93%

---

## Context

Mu H5 is currently a pure real-time MMORPG requiring constant player attention. To compete with modern mobile MMORPGs and attract casual players, we need to add semi-AFK gameplay with auto-hunt functionality.

### Business Drivers
- Increase player retention (casual players can't play actively all day)
- Monetization opportunity (premium auto-hunt features)
- Market competitiveness (most modern MMORPGs have auto-hunt)
- Player feedback requesting this feature

### Technical Constraints
- Must maintain anti-cheat integrity
- Cannot degrade performance for manual players
- Must scale to 1000+ concurrent users
- Must integrate with existing systems (combat, movement, inventory)

---

## Decision

We will implement a **server-side AI system** with a **state machine pattern** to control character behavior during auto-hunt mode.

### Architecture Components

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                      │
│  - AutoHuntUI (controls, settings, status)          │
│  - NetworkClient (WebSocket messages)               │
└─────────────────────────────────────────────────────┘
                         ↕ WebSocket
┌─────────────────────────────────────────────────────┐
│                Presentation Layer                   │
│  - WebSocket Handlers (AUTO_HUNT_*)                 │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│               Application Layer                     │
│  - AutoHuntService (core AI logic)                  │
│  - AutoHuntTickManager (500ms tick system)          │
│  - AutoHuntRestrictionsService (limits, balance)    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                 Domain Layer                        │
│  - AutoHuntStateMachine (behavior states)           │
│  - AutoHuntConfig (settings entity)                 │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│             Infrastructure Layer                    │
│  - AutoHuntRepository (database access)             │
│  - Reuse: CombatService, MovementService, etc.     │
└─────────────────────────────────────────────────────┘
```

### State Machine Design

```typescript
enum AutoHuntState {
  IDLE,              // Waiting for activation
  SEARCHING,         // Looking for nearest monster
  MOVING_TO_TARGET,  // Pathfinding to monster
  ATTACKING,         // In combat
  LOOTING,           // Picking up items
  USING_POTION,      // Consuming HP/MP potion
  RETURNING_TO_SAFE, // Low HP, returning to safe zone
  STUCK,             // Detected stuck, attempting recovery
}

// State transitions
IDLE → SEARCHING (when enabled)
SEARCHING → MOVING_TO_TARGET (monster found)
SEARCHING → IDLE (no monsters, timeout)
MOVING_TO_TARGET → ATTACKING (reached target)
MOVING_TO_TARGET → STUCK (can't reach target)
ATTACKING → LOOTING (monster died)
ATTACKING → USING_POTION (low HP/MP)
ATTACKING → RETURNING_TO_SAFE (critical HP)
LOOTING → SEARCHING (loot complete)
USING_POTION → ATTACKING (potion used)
RETURNING_TO_SAFE → IDLE (reached safe zone)
STUCK → SEARCHING (recovery successful)
```

---

## Rationale

### Why Server-Side AI?

**Pros:**
- ✅ Anti-cheat: All logic validated server-side
- ✅ Consistent behavior across all clients
- ✅ Easier to balance and tune
- ✅ No client-side hacks possible
- ✅ Works even if client disconnects briefly

**Cons:**
- ❌ Server CPU load (mitigated by 500ms tick rate)
- ❌ More complex server implementation

**Alternatives Considered:**
1. **Client-side AI with server validation**
   - Rejected: Too easy to exploit, validation overhead
2. **Hybrid (client predicts, server corrects)**
   - Rejected: Complex synchronization, still exploitable

### Why State Machine Pattern?

**Pros:**
- ✅ Clear, predictable behavior
- ✅ Easy to test each state independently
- ✅ Easy to add new states/behaviors
- ✅ Visual representation possible
- ✅ Debugging friendly

**Alternatives Considered:**
1. **Behavior Trees**
   - Rejected: Overkill for this use case
2. **Utility AI**
   - Rejected: Too complex, harder to balance

### Why 500ms Tick Rate?

**Rationale:**
- Fast enough for responsive gameplay
- Slow enough to minimize server load
- 100 users × 500ms = 50 ticks/second (manageable)
- Can be tuned based on load testing

---

## Consequences

### Positive

1. **Anti-Cheat Integrity**
   - All AI decisions made server-side
   - Impossible to speed hack or teleport
   - Consistent with existing security model

2. **Scalability**
   - 500ms tick rate keeps CPU usage reasonable
   - Can batch process multiple characters
   - Horizontal scaling possible (distribute characters across servers)

3. **Maintainability**
   - State machine is easy to understand
   - Reuses existing services (combat, movement)
   - Clear separation of concerns

4. **Flexibility**
   - Easy to add new AI behaviors
   - Easy to tune balance (efficiency, restrictions)
   - Can enable/disable per character

5. **Business Value**
   - Freemium model (4h free, unlimited premium)
   - Competitive with modern MMORPGs
   - Attracts casual players

### Negative

1. **Server Load**
   - Additional CPU for AI processing
   - Mitigation: 500ms tick rate, optimization, load testing
   - Monitoring: Track CPU usage, add alerts

2. **Complexity**
   - New service layer to maintain
   - State machine logic to test
   - Mitigation: Comprehensive tests, clear documentation

3. **Game Balance Risk**
   - Auto-hunt might be too efficient or too weak
   - Mitigation: Beta testing, efficiency tuning (70% free, 90% premium)
   - Can adjust post-launch based on data

4. **User Experience**
   - Players might find it confusing initially
   - Mitigation: Clear UI, tutorial, documentation

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance degradation | Medium | High | Load testing, phased rollout, monitoring |
| Exploits discovered | Low | High | Server-side validation, security review |
| Game balance issues | Medium | Medium | Beta testing, efficiency tuning |
| User confusion | Low | Low | Clear UI, documentation, tutorial |
| AI gets stuck | Medium | Medium | Stuck detection, recovery logic, teleport |

---

## Alternatives Considered

### Alternative 1: Client-Side AI

**Description:** AI runs on client, server validates actions

**Pros:**
- Lower server load
- More responsive (no network delay)

**Cons:**
- Easy to exploit (modify client AI)
- Server validation overhead
- Inconsistent behavior across clients

**Decision:** Rejected due to security concerns

---

### Alternative 2: Offline Auto-Hunt

**Description:** Character continues hunting even when player logs out

**Pros:**
- Ultimate convenience for players
- Common in mobile MMORPGs

**Cons:**
- Massive server load (all characters always active)
- Complex state management
- Unfair advantage (24/7 farming)

**Decision:** Rejected for v1, consider for v2 if demand exists

---

### Alternative 3: Macro/Script Support

**Description:** Allow players to write custom scripts

**Pros:**
- Maximum flexibility
- Power users love it

**Cons:**
- Extremely hard to balance
- Exploits inevitable
- Unfair for non-technical players

**Decision:** Rejected, against game philosophy

---

## Implementation Plan

### Phase 1: Foundation (Week 1)
1. Database schema (auto_hunt_config table)
2. AutoHuntRepository
3. AutoHuntService core
4. State machine implementation

### Phase 2: Integration (Week 2)
1. WebSocket API
2. Tick system
3. Restrictions & balance
4. Frontend UI

### Phase 3: Testing & Release (Week 3)
1. Unit & property tests
2. Load testing
3. Edge case handling
4. Beta testing
5. Production release

**Full roadmap:** See `AUTO_HUNT_ROADMAP.md`

---

## Success Metrics

### Technical
- ✅ Test coverage ≥80%
- ✅ AI tick processing <50ms per character
- ✅ Support 100+ concurrent auto-hunt users
- ✅ Zero critical bugs in first week
- ✅ <1% error rate

### Business
- 📊 30%+ of players use auto-hunt within first month
- 📊 10%+ conversion to premium auto-hunt
- 📊 20%+ increase in daily active time
- 📊 15%+ increase in 7-day retention

### User Satisfaction
- ⭐ 4.0+ rating for feature
- 💬 Positive feedback >70%
- 🐛 <5 bug reports per 100 users

---

## Monitoring & Observability

### Key Metrics to Track

**Performance:**
- AI tick processing time (p50, p95, p99)
- Active auto-hunt users count
- Server CPU usage
- Memory usage

**Business:**
- Auto-hunt usage rate
- Premium conversion rate
- Daily time used (free vs premium)
- Feature engagement

**Quality:**
- Error rate by state
- Stuck detection frequency
- Death rate during auto-hunt
- User-reported bugs

### Alerts

- 🚨 AI tick processing >100ms (p95)
- 🚨 Error rate >1%
- 🚨 Stuck detection >10% of sessions
- 🚨 Server CPU >80%

---

## Future Enhancements (v2+)

### Potential Features
1. **Advanced AI Behaviors**
   - Smart skill rotation
   - Kiting/positioning
   - Target prioritization (rare monsters)
   - Group farming coordination

2. **Offline Auto-Hunt**
   - Continue hunting when logged out
   - Receive rewards on login
   - Requires significant infrastructure

3. **Auto-Quest**
   - Automatically complete quests
   - Navigate to quest objectives
   - Turn in completed quests

4. **AI Customization**
   - Custom behavior scripts (safe subset)
   - Behavior templates
   - Share configurations

5. **Social Features**
   - Auto-party (join parties automatically)
   - Auto-trade (sell loot automatically)
   - Guild auto-hunt coordination

---

## References

### Similar Implementations
- Ragnarok Mobile: Auto-combat with offline farming
- MU Origin: Auto-hunt with premium features
- Perfect World Mobile: Advanced AI with customization

### Technical Resources
- State Machine Pattern: https://gameprogrammingpatterns.com/state.html
- Server-Side AI: https://www.gamedeveloper.com/design/server-authoritative-multiplayer-game-design
- Anti-Cheat: https://www.gamedeveloper.com/programming/preventing-cheating-in-online-games

---

## Approval

**Team Consensus:** 93% ✅

**Individual Votes:**
- Tech Lead: ✅ Approve (85% confidence)
  - "Server-side approach is correct. Need performance optimization."
  
- QA Engineer: ✅ Approve (75% confidence)
  - "Rigorous testing required. Edge cases are critical."
  
- Product Owner: ✅ Approve (90% confidence)
  - "High priority feature. Freemium model is solid."
  
- Developer: ✅ Approve (80% confidence)
  - "Feasible implementation. 3-week estimate is realistic."

**Final Decision:** Proceed with implementation ✅

**Signed:**
- Tech Lead Agent (2026-03-04)
- Head of Engineering Agent (2026-03-04)

---

**Next Steps:**
1. Create database migration
2. Implement AutoHuntService
3. Follow roadmap timeline

**Status:** 🚀 Implementation in progress
