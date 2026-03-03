# Consensus Building Patterns

## Weighted Voting System

### Agent Weights (Default)

```typescript
const DEFAULT_WEIGHTS = {
  'tech-lead-agent': 2.5,      // Architecture expertise
  'developer-agent': 1.5,       // Implementation feasibility
  'qa-engineer-agent': 2.5,     // Quality impact
  'devops-engineer-agent': 2.0, // Deployment complexity
  'product-owner-agent': 1.8,   // Business value
};
```

### Consensus Calculation

```typescript
function calculateConsensus(responses: AgentResponse[]): number {
  // Load current weights (may be adaptive)
  const weights = loadAgentWeights();
  
  // Calculate weighted approval
  let totalWeight = 0;
  let approvalWeight = 0;
  
  for (const response of responses) {
    const weight = weights[response.agent] || 1.0;
    totalWeight += weight;
    
    if (response.decision === 'Approve') {
      approvalWeight += weight * (response.confidence / 100);
    }
  }
  
  const weightedApproval = approvalWeight / totalWeight;
  
  // Calculate average confidence
  const avgConfidence = responses.reduce((sum, r) => 
    sum + r.confidence, 0) / responses.length / 100;
  
  // Final consensus score
  return (weightedApproval * 0.6) + (avgConfidence * 0.4);
}
```

### Interpretation

| Consensus | Interpretation | Action |
|-----------|----------------|--------|
| ≥90% | Strong consensus | Proceed with confidence |
| 80-89% | Good consensus | Proceed, document concerns |
| 70-79% | Moderate consensus | Proceed with caution, monitor |
| 60-69% | Weak consensus | Consider escalation |
| <60% | No consensus | Escalate to decision maker |

## Multi-Round Discussion

### Round 1: Initial Consultation

**Goal:** Gather initial opinions

**Process:**
1. Present decision context to all agents
2. Ask for initial opinion (Approve/Reject/Modify)
3. Request confidence level and rationale
4. Calculate initial consensus

**If consensus ≥80%:** Proceed to decision
**If consensus <80%:** Move to Round 2

### Round 2: Focused Discussion

**Goal:** Address conflicts and concerns

**Process:**
1. Identify key disagreements
2. Present conflicting viewpoints to all agents
3. Ask agents to reconsider with new information
4. Focus questions on specific concerns
5. Calculate updated consensus

**If consensus ≥75%:** Proceed to decision
**If consensus <75%:** Move to Round 3

### Round 3: Final Attempt

**Goal:** Find compromise or escalate

**Process:**
1. Summarize all perspectives
2. Propose compromise solutions
3. Ask for final opinions
4. Calculate final consensus

**If consensus ≥70%:** Proceed with documented concerns
**If consensus <70%:** Escalate to Head of Engineering

## Conflict Resolution Techniques

### Identify Conflict Type

**Technical Disagreement:**
- Different technical approaches
- Trade-off preferences
- Risk assessment differences

**Priority Conflict:**
- Speed vs quality
- Features vs technical debt
- Short-term vs long-term

**Resource Conflict:**
- Time constraints
- Skill availability
- Budget limitations

### Resolution Strategies

**1. Data-Driven Resolution:**
- Gather objective data
- Run experiments/prototypes
- Benchmark alternatives
- Make evidence-based decision

**2. Compromise Solution:**
- Identify common ground
- Hybrid approach
- Phased implementation
- Pilot program

**3. Escalation:**
- Present all perspectives fairly
- Provide recommendation
- Let decision maker choose
- Document rationale

## Parallel Consultation

### Benefits

- **Speed:** All agents consulted simultaneously
- **Independence:** No groupthink
- **Efficiency:** No waiting for sequential responses
- **Diversity:** Multiple perspectives captured

### Implementation

```typescript
async function parallelConsultation(
  agents: string[],
  prompt: string
): Promise<AgentResponse[]> {
  // Invoke all agents in parallel
  const promises = agents.map(agent => 
    invokeSubAgent({
      name: agent,
      prompt: prompt,
      explanation: `Consulting ${agent} for decision input`
    })
  );
  
  // Wait for all responses
  const responses = await Promise.all(promises);
  
  // Parse and structure responses
  return responses.map(parseAgentResponse);
}
```

### Timeout Handling

```typescript
async function parallelConsultationWithTimeout(
  agents: string[],
  prompt: string,
  timeout: number = 30000
): Promise<AgentResponse[]> {
  const promises = agents.map(agent =>
    Promise.race([
      invokeSubAgent({ name: agent, prompt }),
      timeoutPromise(timeout, agent)
    ])
  );
  
  const responses = await Promise.allSettled(promises);
  
  // Handle timeouts gracefully
  return responses
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}
```

## Partial Consensus

### Minimum Quorum

**Requirement:** At least 60% of agents must respond

**Calculation:**
```typescript
function hasQuorum(
  responses: AgentResponse[],
  totalAgents: number
): boolean {
  return responses.length / totalAgents >= 0.6;
}
```

### Weighted Quorum

**Requirement:** At least 60% of total weight must respond

```typescript
function hasWeightedQuorum(
  responses: AgentResponse[],
  weights: Record<string, number>
): boolean {
  const totalWeight = Object.values(weights)
    .reduce((sum, w) => sum + w, 0);
  
  const respondedWeight = responses
    .reduce((sum, r) => sum + (weights[r.agent] || 1.0), 0);
  
  return respondedWeight / totalWeight >= 0.6;
}
```

### Handling Partial Responses

**If quorum met:**
- Calculate consensus with available responses
- Document which agents didn't respond
- Proceed if consensus ≥80%

**If quorum not met:**
- Retry with longer timeout
- Escalate to decision maker
- Document timeout issues

## Confidence Intervals

### Calculate Uncertainty

```typescript
function calculateConsensusWithUncertainty(
  responses: AgentResponse[]
): ConsensusResult {
  const scores = responses.map(r => r.confidence / 100);
  const mean = scores.reduce((a, b) => a + b) / scores.length;
  
  const variance = scores
    .reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) 
    / scores.length;
  
  const stdDev = Math.sqrt(variance);
  
  return {
    consensus: mean,
    uncertainty: stdDev,
    confidenceInterval: {
      lower: mean - 1.96 * stdDev,  // 95% CI
      upper: mean + 1.96 * stdDev,
    }
  };
}
```

### Interpretation

**Low Uncertainty (stdDev < 0.1):**
- Agents agree strongly
- High confidence in decision
- Proceed with confidence

**Moderate Uncertainty (stdDev 0.1-0.2):**
- Some disagreement
- Moderate confidence
- Proceed with caution

**High Uncertainty (stdDev > 0.2):**
- Significant disagreement
- Low confidence
- Consider escalation or more discussion

## Best Practices

### Consultation
- ✅ Consult all relevant stakeholders
- ✅ Use parallel consultation for speed
- ✅ Set reasonable timeouts (30s per agent)
- ✅ Handle partial responses gracefully

### Synthesis
- ✅ Present all perspectives fairly
- ✅ Identify key agreements and disagreements
- ✅ Calculate consensus objectively
- ✅ Document uncertainty

### Decision Support
- ✅ Provide clear recommendation
- ✅ Explain trade-offs
- ✅ Respect decision maker's authority
- ✅ Document final decision and rationale

### Learning
- ✅ Track all decisions
- ✅ Measure outcomes
- ✅ Adjust weights based on accuracy
- ✅ Identify successful patterns
