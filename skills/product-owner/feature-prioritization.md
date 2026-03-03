# Feature Prioritization Skill
## Product Owner

**Version:** 1.0.0  
**Created:** March 3, 2026

---

## 🎯 Purpose

Enable Product Owner to prioritize features, define requirements, make business decisions, and ensure the autonomous AI team builds the right things.

---

## 🧠 Core Competencies

### 1. Feature Prioritization

**What:** Decide which features to build and in what order

**Framework: RICE Scoring**
```
RICE Score = (Reach × Impact × Confidence) / Effort

Reach: How many users affected (per quarter)
Impact: How much it helps (0.25=minimal, 0.5=low, 1=medium, 2=high, 3=massive)
Confidence: How sure are we (0-100%)
Effort: How much work (person-months)
```

**Example:**
```
Feature: User authentication
- Reach: 1000 users/quarter
- Impact: 3 (massive - required for all features)
- Confidence: 100%
- Effort: 2 person-months

RICE = (1000 × 3 × 1.0) / 2 = 1500

Feature: Dark mode
- Reach: 500 users/quarter
- Impact: 0.5 (low - nice to have)
- Confidence: 80%
- Effort: 1 person-month

RICE = (500 × 0.5 × 0.8) / 1 = 200

Priority: Authentication (1500) > Dark mode (200)
```

### 2. Requirements Definition

**What:** Clearly define what needs to be built

**User Story Format:**
```
As a [user type]
I want to [action]
So that [benefit]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

**Example:**
```
As a player
I want to create a character
So that I can start playing the game

Acceptance Criteria:
- [ ] User can enter character name (3-20 characters)
- [ ] User can select character class (Warrior/Mage/Archer)
- [ ] User can customize appearance (hair, skin, eyes)
- [ ] Character is saved to database
- [ ] User is redirected to game world
- [ ] Character appears in character list
```

### 3. Backlog Management

**What:** Maintain prioritized list of work

**Backlog Structure:**
```
Now (Sprint)
├── High priority, ready to start
├── Clear requirements
└── Estimated effort

Next (Next 2-3 sprints)
├── Medium priority
├── Requirements defined
└── Rough estimates

Later (Future)
├── Low priority
├── Ideas and concepts
└── Not yet estimated

Icebox (Maybe never)
├── Nice to have
├── Low value
└── Deferred indefinitely
```

### 4. Stakeholder Communication

**What:** Keep stakeholders informed and aligned

**Communication Cadence:**
- Daily: Quick updates to team
- Weekly: Progress report to stakeholders
- Monthly: Roadmap review
- Quarterly: Strategic planning

**Status Report Template:**
```markdown
[PO] Weekly Status

Completed This Week:
- Feature 1 (shipped to production)
- Feature 2 (in QA)

In Progress:
- Feature 3 (development)
- Feature 4 (design)

Next Week:
- Feature 5 (starting)
- Feature 6 (planning)

Blockers:
- None / [List blockers]

Metrics:
- User satisfaction: X/10
- Feature adoption: X%
- Active users: X
```

### 5. Business Value Assessment

**What:** Evaluate business impact of features

**Value Metrics:**
- User acquisition: New users gained
- User retention: Users who stay
- Revenue: Money generated
- Cost savings: Money saved
- User satisfaction: Happiness score

**ROI Calculation:**
```
ROI = (Value - Cost) / Cost × 100%

Example:
Feature: Premium subscription
- Development cost: $10,000
- Expected revenue: $50,000/year
- ROI = ($50,000 - $10,000) / $10,000 × 100% = 400%
```

---

## 📋 Prioritization Frameworks

### 1. MoSCoW Method

**Must Have:**
- Critical for launch
- Cannot ship without
- Legal/compliance requirements

**Should Have:**
- Important but not critical
- Can be delayed if needed
- Significant value

**Could Have:**
- Nice to have
- Low priority
- Include if time permits

**Won't Have (this time):**
- Out of scope
- Low value
- Deferred to future

### 2. Kano Model

**Basic Needs:**
- Expected by users
- Dissatisfaction if missing
- No extra satisfaction if present
- Example: Login functionality

**Performance Needs:**
- More is better
- Linear satisfaction
- Example: Loading speed

**Excitement Needs:**
- Unexpected delights
- High satisfaction if present
- No dissatisfaction if missing
- Example: Easter eggs

### 3. Value vs Effort Matrix

```
High Value, Low Effort → Do First (Quick Wins)
High Value, High Effort → Do Next (Major Projects)
Low Value, Low Effort → Do Later (Fill-ins)
Low Value, High Effort → Don't Do (Money Pit)
```

---

## 🎯 Roadmap Planning

### Quarterly Roadmap

**Q1 2026 Example:**
```markdown
# Q1 2026 Roadmap

## Theme: Core Gameplay

### Must Have (P0)
1. User authentication (2 weeks)
2. Character creation (2 weeks)
3. Basic combat system (4 weeks)
4. Inventory management (2 weeks)

### Should Have (P1)
5. Quest system (3 weeks)
6. Trading system (2 weeks)

### Could Have (P2)
7. Guild system (3 weeks)
8. Leaderboards (1 week)

## Success Metrics
- 1000 active users
- 50% retention (7 days)
- 4.0+ app store rating
```

### Release Planning

**Release Cadence:**
- Major releases: Quarterly
- Minor releases: Monthly
- Patches: As needed

**Release Checklist:**
```markdown
## Release Checklist

Pre-Release:
- [ ] All features complete
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Release notes written
- [ ] Stakeholders notified

Release:
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Monitor metrics
- [ ] Announce to users

Post-Release:
- [ ] Gather feedback
- [ ] Monitor adoption
- [ ] Track metrics
- [ ] Plan next release
```

---

## 📊 Metrics & Analytics

### Product Metrics

**Acquisition:**
- New users per day/week/month
- Acquisition channels
- Cost per acquisition

**Activation:**
- % users who complete onboarding
- Time to first value
- Feature adoption rate

**Retention:**
- Daily/Weekly/Monthly active users
- Churn rate
- Cohort retention

**Revenue:**
- Monthly recurring revenue (MRR)
- Average revenue per user (ARPU)
- Lifetime value (LTV)

**Referral:**
- Viral coefficient
- Net promoter score (NPS)
- Word-of-mouth growth

### Feature Success Metrics

**For Each Feature:**
```markdown
Feature: [Name]

Success Metrics:
- Adoption: X% of users use it
- Engagement: Users use it X times/week
- Satisfaction: X/10 rating
- Business impact: $X revenue or X% retention

Measurement:
- Track: [How to measure]
- Timeline: [When to evaluate]
- Target: [Success threshold]
```

---

## 🎨 User Research

### Research Methods

**Quantitative:**
- Analytics data
- A/B testing
- Surveys
- Usage metrics

**Qualitative:**
- User interviews
- Usability testing
- Feedback forms
- Support tickets

### User Personas

**Template:**
```markdown
## Persona: [Name]

**Demographics:**
- Age: [Range]
- Location: [Where]
- Occupation: [What]

**Goals:**
- [Goal 1]
- [Goal 2]

**Pain Points:**
- [Pain 1]
- [Pain 2]

**Behaviors:**
- [Behavior 1]
- [Behavior 2]

**Quote:**
"[Typical user quote]"
```

### User Journey Mapping

```
Awareness → Consideration → Purchase → Onboarding → Usage → Advocacy

For each stage:
- User actions
- User thoughts
- User emotions
- Pain points
- Opportunities
```

---

## 🤝 Collaboration with Team

### With Tech Lead

**Discuss:**
- Technical feasibility
- Architecture implications
- Technical debt trade-offs
- Performance requirements

**Example:**
```
PO: "Can we add real-time chat?"
Tech Lead: "Yes, but requires WebSocket infrastructure. 
            Adds complexity. Estimate 3 weeks."
PO: "High value feature. Let's prioritize."
```

### With QA Lead

**Discuss:**
- Acceptance criteria
- Test scenarios
- Quality standards
- Release readiness

### With DevOps Lead

**Discuss:**
- Deployment strategy
- Infrastructure needs
- Scalability requirements
- Monitoring requirements

### With Developer

**Discuss:**
- Requirements clarification
- Edge cases
- User stories
- Implementation questions

---

## 🚀 Feature Launch Process

### Pre-Launch

```markdown
## Pre-Launch Checklist

- [ ] Requirements finalized
- [ ] Design approved
- [ ] Development complete
- [ ] Tests passing
- [ ] Documentation ready
- [ ] Marketing materials prepared
- [ ] Support team trained
- [ ] Metrics tracking configured
```

### Launch

```markdown
## Launch Day

1. Deploy to production
2. Verify functionality
3. Monitor metrics closely
4. Announce to users
5. Respond to feedback
6. Address issues quickly
```

### Post-Launch

```markdown
## Post-Launch (First Week)

- [ ] Monitor adoption metrics
- [ ] Gather user feedback
- [ ] Track support tickets
- [ ] Measure success metrics
- [ ] Identify improvements
- [ ] Plan iteration
```

---

## 💡 Decision-Making

### Feature Decision Framework

**Question:** Should we build this feature?

**Evaluate:**
1. **User Value:** Does it solve a real problem?
2. **Business Value:** Does it support our goals?
3. **Feasibility:** Can we build it?
4. **Cost:** What's the effort required?
5. **Risk:** What could go wrong?
6. **Timing:** Is now the right time?

**Decision Matrix:**
```
High Value + Low Cost = YES (Do now)
High Value + High Cost = MAYBE (Evaluate carefully)
Low Value + Low Cost = MAYBE (If time permits)
Low Value + High Cost = NO (Don't do)
```

### Trade-off Decisions

**Speed vs Quality:**
- Fast: MVP, iterate later
- Quality: Polish before launch
- Decision: Depends on market timing

**Features vs Debt:**
- Features: New capabilities
- Debt: Fix technical issues
- Decision: Balance (70% features, 30% debt)

**Build vs Buy:**
- Build: Custom solution
- Buy: Third-party service
- Decision: Buy if not core competency

---

## 🎯 Success Criteria

### Effective Product Ownership

**You're doing well if:**
- ✅ Team always has clear priorities
- ✅ Features deliver expected value
- ✅ Users are satisfied (NPS >50)
- ✅ Business metrics improving
- ✅ Stakeholders are aligned
- ✅ Roadmap is clear and achievable

**You need to improve if:**
- ❌ Team unclear on priorities
- ❌ Features don't deliver value
- ❌ Users are unhappy
- ❌ Business metrics declining
- ❌ Stakeholder confusion
- ❌ Roadmap constantly changing

---

## 🎓 Continuous Learning

### Stay Informed

**Read:**
- User feedback daily
- Analytics weekly
- Industry trends monthly
- Competitor analysis quarterly

**Learn:**
- User research methods
- Product management frameworks
- Business strategy
- Market dynamics

### Improve

**Weekly:**
- Review feature performance
- Gather user feedback
- Adjust priorities
- Communicate updates

**Monthly:**
- Analyze metrics trends
- Review roadmap
- Stakeholder sync
- Team retrospective

**Quarterly:**
- Strategic planning
- Market analysis
- Competitive review
- Vision refinement

---

**This skill enables you to prioritize effectively, define clear requirements, make business decisions, and ensure the autonomous AI team builds valuable features.**

**Last Updated:** March 3, 2026  
**Version:** 1.0.0
