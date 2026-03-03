---
title: Architecture Guidelines
inclusion: always
---

# Hướng Dẫn Kiến Trúc Hệ Thống

## Architectural Principles

### 1. Separation of Concerns
- Tách biệt business logic, data access, presentation
- Mỗi layer có trách nhiệm rõ ràng
- Minimize coupling giữa các components

### 2. Scalability First
- Design cho horizontal scaling
- Stateless services khi có thể
- Caching strategy rõ ràng
- Database sharding considerations

### 3. Maintainability
- Clean code principles
- Consistent patterns across codebase
- Easy to understand và modify
- Comprehensive documentation

## Layered Architecture

```
┌─────────────────────────────────┐
│     Presentation Layer          │  (UI, API Controllers)
├─────────────────────────────────┤
│     Application Layer           │  (Use Cases, Business Logic)
├─────────────────────────────────┤
│     Domain Layer                │  (Entities, Domain Logic)
├─────────────────────────────────┤
│     Infrastructure Layer        │  (Database, External APIs)
└─────────────────────────────────┘
```

### Presentation Layer
- Controllers/Handlers
- Request/Response DTOs
- Input validation
- Authentication/Authorization

### Application Layer
- Use cases/Services
- Business workflows
- Transaction management
- Application-specific logic

### Domain Layer
- Core business entities
- Domain logic và rules
- Domain events
- Value objects

### Infrastructure Layer
- Database repositories
- External API clients
- File system access
- Third-party integrations

## Design Patterns

### Creational Patterns
- **Factory**: Tạo objects phức tạp
- **Builder**: Construct objects từng bước
- **Singleton**: Shared instances (use sparingly)

### Structural Patterns
- **Adapter**: Interface compatibility
- **Decorator**: Add functionality dynamically
- **Facade**: Simplified interface

### Behavioral Patterns
- **Strategy**: Interchangeable algorithms
- **Observer**: Event-driven communication
- **Command**: Encapsulate requests

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods correctly (GET, POST, PUT, DELETE, PATCH)
- Proper status codes
- Versioning strategy (v1, v2)

### Request/Response Format
```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-03-02T00:00:00Z",
    "version": "1.0"
  },
  "errors": []
}
```

### Error Handling
```json
{
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input",
      "field": "email",
      "details": "Email format is invalid"
    }
  ]
}
```

## Database Design

### Normalization
- 3NF cho transactional data
- Denormalization cho read-heavy scenarios
- Balance giữa consistency và performance

### Indexing Strategy
- Index foreign keys
- Composite indexes cho common queries
- Monitor index usage
- Regular index maintenance

### Migration Strategy
- Version-controlled migrations
- Rollback capability
- Zero-downtime deployments
- Data migration scripts

## Microservices Guidelines

### Service Boundaries
- Domain-driven design
- Bounded contexts
- Independent deployment
- Own database per service

### Communication
- Synchronous: REST/gRPC
- Asynchronous: Message queues
- Event-driven architecture
- API Gateway pattern

### Data Management
- Eventual consistency
- Saga pattern cho distributed transactions
- CQRS khi phù hợp
- Event sourcing cho audit trail

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── common/      # Reusable components
│   ├── features/    # Feature-specific
│   └── layouts/     # Page layouts
├── services/        # API clients
├── stores/          # State management
├── utils/           # Helper functions
└── types/           # TypeScript types
```

### State Management
- Local state cho UI-only data
- Global state cho shared data
- Server state caching (React Query, SWR)
- Immutable updates

### Performance Optimization
- Code splitting
- Lazy loading
- Memoization
- Virtual scrolling cho large lists
- Image optimization

## Security Architecture

### Authentication & Authorization
- JWT tokens với refresh mechanism
- Role-based access control (RBAC)
- OAuth2/OpenID Connect
- Multi-factor authentication

### Data Protection
- Encryption at rest
- Encryption in transit (TLS)
- Sensitive data masking
- PII handling compliance

### API Security
- Rate limiting
- CORS configuration
- Input sanitization
- SQL injection prevention
- XSS protection

## Monitoring & Observability

### Logging
- Structured logging (JSON)
- Log levels (DEBUG, INFO, WARN, ERROR)
- Correlation IDs
- No sensitive data in logs

### Metrics
- Application metrics (response time, throughput)
- Business metrics (conversions, user actions)
- Infrastructure metrics (CPU, memory, disk)
- Custom metrics

### Tracing
- Distributed tracing
- Request flow visualization
- Performance bottleneck identification
- Error tracking

## Deployment Architecture

### Environments
- Development
- Staging (production-like)
- Production
- Environment parity

### CI/CD Pipeline
```
Code Push → Build → Test → Security Scan → Deploy → Monitor
```

### Infrastructure as Code
- Terraform/CloudFormation
- Version controlled
- Automated provisioning
- Disaster recovery plan

## Autonomous Architecture Decisions
### For 100% AI Team

**Purpose:** Define when and how AI agents can make architecture decisions autonomously.

---

### Decision Complexity Scale

**Complexity Assessment (1-10):**

**1-3: Simple (AI Autonomous)**
- Code organization within existing structure
- Refactoring without interface changes
- Performance optimizations (non-breaking)
- Adding utility functions
- Internal implementation details

**4-6: Moderate (Team Consensus Required)**
- New design pattern adoption
- API contract modifications
- Database schema changes
- New service introduction
- Caching strategy changes

**7-8: Complex (HOE Approval Required)**
- Architecture pattern changes
- Breaking API changes
- Major refactoring
- Technology stack additions
- Cross-service dependencies

**9-10: Critical (External Escalation)**
- Architecture paradigm shifts
- Complete system redesign
- Major technology replacements
- Compliance-affecting changes
- Security architecture changes

---

### AI Can Decide Autonomously (Complexity 1-3)

**Code Structure & Organization:**
- ✅ Reorganize files within layer
- ✅ Extract functions/classes
- ✅ Rename internal components
- ✅ Add helper utilities
- ✅ Refactor for readability

**Design Patterns (Within Approved List):**
- ✅ Apply Factory pattern
- ✅ Apply Strategy pattern
- ✅ Apply Observer pattern
- ✅ Apply Decorator pattern
- ✅ Apply Adapter pattern

**Performance Optimizations:**
- ✅ Add caching (local/memory)
- ✅ Optimize queries (same schema)
- ✅ Add indexes (non-breaking)
- ✅ Lazy loading
- ✅ Code splitting

**Refactoring:**
- ✅ Extract methods
- ✅ Remove duplication
- ✅ Simplify conditionals
- ✅ Improve naming
- ✅ Maintain interfaces

**Conditions:**
- No breaking changes
- Maintains existing interfaces
- Passes all tests
- Quality score ≥7.0
- No performance regression

---

### Requires Team Consensus (Complexity 4-6)

**Consensus Threshold:** ≥80%

**API Changes:**
- ⚠️ Add new endpoints
- ⚠️ Modify request/response format
- ⚠️ Change status codes
- ⚠️ Add new parameters
- ⚠️ Deprecate endpoints

**Database Changes:**
- ⚠️ Add new tables
- ⚠️ Add new columns
- ⚠️ Modify indexes
- ⚠️ Change constraints
- ⚠️ Data migrations

**New Technology (Within Stack):**
- ⚠️ Add new library (approved list)
- ⚠️ Adopt new framework feature
- ⚠️ Change build tool configuration
- ⚠️ Add new testing framework

**Architecture Patterns:**
- ⚠️ Introduce new layer
- ⚠️ Add new service
- ⚠️ Change communication pattern
- ⚠️ Modify data flow

**Process:**
```
1. AI proposes architecture change
   ↓
2. Team Coordinator facilitates consensus
   ↓
3. Consult: Tech Lead (2.5x), QA (2.5x), Developer (1.5x), DevOps (2.0x)
   ↓
4. Calculate consensus
   ↓
5. If ≥80%: Proceed with implementation
   If <80%: Escalate to HOE
```

---

### Requires HOE Approval (Complexity 7-8)

**Breaking Changes:**
- ❌ Remove public APIs
- ❌ Change API contracts (breaking)
- ❌ Modify database schema (breaking)
- ❌ Change authentication mechanism
- ❌ Alter data models (breaking)

**Major Refactoring:**
- ❌ Restructure entire layer
- ❌ Change architecture pattern
- ❌ Migrate to new framework
- ❌ Rewrite major components

**Technology Decisions:**
- ❌ Add new technology (not in approved list)
- ❌ Replace existing technology
- ❌ Change programming language
- ❌ Adopt new architecture style

**Process:**
```
1. Team consensus <80% OR high complexity
   ↓
2. Escalate to Head of Engineering
   ↓
3. HOE reviews:
   - Business impact
   - Technical feasibility
   - Risk assessment
   - Resource requirements
   ↓
4. HOE makes final decision
   ↓
5. If approved: Proceed with team implementation
   If rejected: Document rationale and alternatives
```

---

### Requires External Escalation (Complexity 9-10)

**Strategic Architecture Changes:**
- 🚨 Microservices → Monolith (or vice versa)
- 🚨 Complete system redesign
- 🚨 Change core technology stack
- 🚨 Adopt new architecture paradigm

**Compliance/Legal Impact:**
- 🚨 Changes affecting data privacy
- 🚨 Changes affecting security compliance
- 🚨 Changes affecting regulatory requirements

**Business-Critical:**
- 🚨 Changes affecting SLAs
- 🚨 Changes requiring significant budget
- 🚨 Changes affecting customer contracts

**Process:**
```
1. HOE identifies need for external escalation
   ↓
2. Prepare comprehensive proposal:
   - Business case
   - Technical analysis
   - Risk assessment
   - Cost-benefit analysis
   - Timeline
   ↓
3. Present to stakeholders (CTO, CEO, Board)
   ↓
4. Await external decision
   ↓
5. Implement based on approval
```

---

### Architecture Decision Records (ADR)

**All Architecture Decisions Must Be Documented:**

**ADR Format:**
```markdown
# ADR-XXX: [Title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Rejected | Superseded
**Deciders:** [List of agents/roles]
**Complexity:** X/10
**Consensus:** XX%

## Context
[What is the issue we're trying to solve?]

## Decision
[What architecture decision did we make?]

## Rationale
[Why did we choose this approach?]

## Consequences
**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative:**
- [Trade-off 1]
- [Trade-off 2]

**Risks:**
- [Risk 1]
- [Risk 2]

## Alternatives Considered
1. [Alternative 1] - [Why rejected]
2. [Alternative 2] - [Why rejected]

## Implementation Plan
1. [Step 1]
2. [Step 2]

## Success Metrics
- [Metric 1]
- [Metric 2]
```

**Storage:** `.kiro/memory/architecture-decisions/ADR-XXX-title.md`

---

### Learning from Architecture Decisions

**Track Outcomes:**

```json
{
  "adr_id": "ADR-001",
  "decision": "Adopt Redis for caching",
  "complexity": 5,
  "consensus": 0.85,
  "implementation_date": "2026-03-03",
  "outcome": {
    "success": true,
    "performance_improvement": "40%",
    "issues_encountered": ["Initial connection pooling"],
    "lessons_learned": [
      "Connection pooling critical for performance",
      "Monitor memory usage closely"
    ]
  }
}
```

**Success Patterns:**
- High consensus + successful outcome → Learn approach
- Fast implementation + no issues → Learn pattern
- Performance improvement achieved → Replicate strategy

**Anti-Patterns:**
- Low consensus + failed outcome → Avoid approach
- Implementation issues → Identify root cause
- Performance regression → Learn what to avoid

**Adaptive Recommendations:**
```
Based on historical data:
- Similar decision X succeeded with approach Y
- Avoid pattern Z (failed 3 times)
- Consider alternative A (80% success rate)
```

---

### Architecture Review Checklist

**Before Making Architecture Decision:**

**Technical Assessment:**
- [ ] Complexity score calculated (1-10)
- [ ] Impact analysis completed
- [ ] Alternatives evaluated
- [ ] Risks identified
- [ ] Dependencies mapped

**Team Assessment:**
- [ ] Relevant agents consulted
- [ ] Consensus calculated
- [ ] Dissenting opinions documented
- [ ] Escalation path clear

**Quality Assessment:**
- [ ] Maintains code quality
- [ ] Improves maintainability
- [ ] No security regressions
- [ ] Performance impact assessed
- [ ] Testing strategy defined

**Business Assessment:**
- [ ] Business value clear
- [ ] Cost estimated
- [ ] Timeline realistic
- [ ] Stakeholder impact assessed

---

### Approved Technology Stack

**AI Can Use (No Approval):**

**Frontend:**
- Phaser 3, TypeScript, Webpack
- React (if needed for UI)
- CSS/SCSS

**Backend:**
- Node.js, Express, TypeScript
- WebSocket (ws library)

**Database:**
- PostgreSQL 15+
- Redis 4+

**Testing:**
- Jest, fast-check
- Supertest (API testing)

**Tools:**
- ESLint, Prettier
- TypeScript compiler
- npm/yarn

**AI Requires Consensus:**
- New libraries (within ecosystem)
- New testing frameworks
- New build tools
- New monitoring tools

**AI Requires HOE Approval:**
- New programming languages
- New databases
- New frameworks (major)
- New architecture patterns

---

### Architecture Evolution Guidelines

**Continuous Improvement:**

**Weekly:**
- Review architecture decisions made
- Assess outcomes
- Identify patterns
- Update recommendations

**Monthly:**
- Analyze architecture trends
- Identify technical debt
- Propose improvements
- Update approved stack

**Quarterly:**
- Strategic architecture review
- Technology stack evaluation
- Major refactoring planning
- Architecture roadmap update

**Principles:**
- Evolve incrementally
- Maintain backward compatibility when possible
- Document all changes
- Learn from outcomes
- Adapt based on data

---

### Architecture Debt Management

**AI Can Identify:**
- ✅ Code smells
- ✅ Duplication
- ✅ Complexity hotspots
- ✅ Performance bottlenecks
- ✅ Security vulnerabilities

**AI Can Fix (Autonomously):**
- ✅ Simple refactoring
- ✅ Code cleanup
- ✅ Documentation updates
- ✅ Test improvements

**AI Requires Consensus:**
- ⚠️ Major refactoring
- ⚠️ Architecture changes
- ⚠️ Breaking changes

**Debt Tracking:**
```json
{
  "debt_id": "DEBT-001",
  "type": "architecture",
  "description": "Monolithic auth service needs splitting",
  "severity": "medium",
  "estimated_effort": "2 weeks",
  "business_impact": "Blocks scaling",
  "proposed_solution": "Extract to microservice",
  "status": "identified"
}
```

---

## Summary: Autonomous Architecture Decisions

**Complexity Thresholds:**
- 1-3: AI Autonomous ✅
- 4-6: Team Consensus (≥80%) ⚠️
- 7-8: HOE Approval ❌
- 9-10: External Escalation 🚨

**Key Principles:**
- Start small, evolve incrementally
- Document all decisions (ADR)
- Learn from outcomes
- Maintain quality standards
- Respect escalation thresholds

**This framework enables AI team to make architecture decisions efficiently while maintaining appropriate oversight for complex changes.**

