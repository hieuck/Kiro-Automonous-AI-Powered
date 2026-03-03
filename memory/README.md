# Memory Directory

**Purpose:** Store agent memory and learning data for autonomous AI team  
**Status:** Ready for production  
**Last Updated:** March 3, 2026

---

## Structure

```
memory/
├── decisions/              # Decision tracking
│   ├── index.json         # Decision index
│   ├── dec-*.json         # Individual decisions
│   └── README.md          # Documentation
├── learning/              # Learning system
│   └── patterns/          # Success & anti-patterns
│       └── README.md      # Pattern documentation
├── metrics/               # Performance metrics
│   ├── YYYY-MM.json      # Monthly metrics
│   └── README.md          # Metrics documentation
├── agent-weights.json     # Adaptive agent weights
└── README.md              # This file
```

---

## Components

### 1. Decision Tracking (`decisions/`)
Stores all team decisions for learning and continuous improvement.
- Automatic logging via `decision-logging.kiro.hook`
- Tracks context, participants, consensus, outcomes
- Used for agent weight updates and pattern recognition

### 2. Learning Patterns (`learning/patterns/`)
Identified patterns from team decisions and outcomes.
- Success patterns (>90% success rate)
- Anti-patterns (<70% success rate)
- Automatically identified by monthly review
- Referenced in future decision-making

### 3. Performance Metrics (`metrics/`)
Team and agent performance tracking.
- Autonomy rate, decision accuracy, quality scores
- Agent-level metrics (accuracy, response time, calibration)
- Weekly and monthly aggregation
- Trend analysis

### 4. Agent Weights (`agent-weights.json`)
Adaptive weights for consensus calculation.
- Updated weekly based on decision accuracy
- History tracked for transparency
- Enables continuous improvement

---

## Usage

The memory system operates automatically:

1. **Decision Logging:** Every team decision is logged with full context
2. **Weekly Assessment:** Metrics calculated, agent weights updated
3. **Monthly Review:** Patterns identified, strategic insights generated
4. **Continuous Learning:** System improves based on outcomes

No manual intervention required - fully autonomous.

---

## Current State

**Decisions:** 1 example  
**Patterns:** 0 (will be identified from real decisions)  
**Metrics:** Ready for first data  
**Agent Weights:** Initialized with base weights  

**Status:** ✅ Ready for production use

---

**Last Updated:** March 3, 2026  
**Version:** 1.0.0
