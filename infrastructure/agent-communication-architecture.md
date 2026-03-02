# Agent Communication Architecture

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-03-02

---

## Overview

Infrastructure for autonomous multi-agent coordination enabling dev team sub-agents to discuss and decide without manual invocation.

## Architecture Components

### 1. Event-Driven Message Bus

**Technology:** Redis Pub/Sub (or in-memory for MVP)

```typescript
interface AgentMessage {
  id: string;
  correlationId: string;
  from: AgentRole;
  to: AgentRole | 'broadcast';
  type: 'proposal' | 'feedback' | 'vote' | 'decision';
  content: any;
  timestamp: number;
  metadata: {
    taskId?: string;
    discussionId: string;
    round: number;
  };
}
```

### 2. Agent Registry

**Purpose:** Dynamic agent discovery and capability mapping

```typescript
interface AgentCapability {
  role: AgentRole;
  expertise: string[];
  decisionDomains: string[];
  availability: 'active' | 'busy' | 'offline';
  responseTimeAvg: number;
}

const agentRegistry = {
  'product-owner': {
    expertise: ['requirements', 'prioritization', 'business-value'],
    decisionDomains: ['feature-scope', 'timeline', 'roi-analysis']
  },
  'tech-lead': {
    expertise: ['architecture', 'technical-design', 'code-review'],
    decisionDomains: ['architecture-patterns', 'technology-selection', 'technical-risk']
  },
  'developer': {
    expertise: ['implementation', 'coding', 'debugging'],
    decisionDomains: ['code-structure', 'algorithm-selection', 'library-choice']
  },
  'qa-engineer': {
    expertise: ['testing', 'quality-assurance', 'validation'],
    decisionDomains: ['test-strategy', 'coverage-requirements', 'quality-gates']
  },
  'devops-engineer': {
    expertise: ['deployment', 'infrastructure', 'monitoring'],
    decisionDomains: ['ci-cd', 'infrastructure-changes', 'deployment-strategy']
  }
};
```

### 3. Context-Aware Agent Router

**Purpose:** Automatically determine which agents to involve

```typescript
function routeToAgents(context: TaskContext): AgentRole[] {
  const requiredAgents: Set<AgentRole> = new Set();
  
  // Complexity-based routing
  if (context.complexity > 70) {
    requiredAgents.add('tech-lead');
  }
  
  // Domain-based routing
  if (context.domains.includes('architecture')) {
    requiredAgents.add('tech-lead');
  }
  if (context.domains.includes('testing')) {
    requiredAgents.add('qa-engineer');
  }
  if (context.domains.includes('deployment')) {
    requiredAgents.add('devops-engineer');
  }
  
  // Risk-based routing
  if (context.riskScore > 60) {
    requiredAgents.add('product-owner');
    requiredAgents.add('tech-lead');
  }
  
  // Always include developer for implementation
  requiredAgents.add('developer');
  
  return Array.from(requiredAgents);
}
```

## Communication Protocols

### Discussion Lifecycle

```
1. INITIATION
   ├─ Task created/modified
   ├─ Context analysis
   └─ Agent routing

2. PROPOSAL PHASE
   ├─ Initiator broadcasts proposal
   ├─ Agents receive and analyze
   └─ Timeout: 30s

3. FEEDBACK PHASE
   ├─ Agents provide feedback
   ├─ Multi-round discussion (max 5 rounds)
   └─ Timeout per round: 20s

4. VOTING PHASE
   ├─ Each agent casts vote
   ├─ Weighted by expertise
   └─ Timeout: 10s

5. DECISION PHASE
   ├─ Consensus calculation
   ├─ Decision recording
   └─ Execution or escalation
```

## Loop Prevention

### Circular Dependency Detection

```typescript
class DiscussionTracker {
  private invocationChain: Map<string, AgentRole[]> = new Map();
  
  detectCircular(discussionId: string, agent: AgentRole): boolean {
    const chain = this.invocationChain.get(discussionId) || [];
    
    if (chain.includes(agent)) {
      console.warn(`Circular dependency detected: ${chain.join(' → ')} → ${agent}`);
      return true;
    }
    
    chain.push(agent);
    this.invocationChain.set(discussionId, chain);
    
    if (chain.length > 10) {
      console.error(`Discussion chain too deep: ${chain.length}`);
      return true;
    }
    
    return false;
  }
}
```

## Performance Optimization

### Parallel Agent Invocation

```typescript
async function invokeAgentsParallel(
  agents: AgentRole[],
  context: TaskContext
): Promise<AgentResponse[]> {
  const promises = agents.map(agent => 
    invokeAgent(agent, context, { timeout: 30000 })
  );
  
  return Promise.allSettled(promises).then(results =>
    results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
  );
}
```

### Response Caching

```typescript
class ResponseCache {
  private cache: Map<string, CachedResponse> = new Map();
  
  getCached(context: TaskContext, agent: AgentRole): AgentResponse | null {
    const key = `${agent}:${context.type}:${context.complexity}`;
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < 3600000) {
      return cached.response;
    }
    
    return null;
  }
}
```

## Integration with Kiro Hooks

```json
{
  "name": "Auto Team Discussion",
  "version": "1.0.0",
  "when": {
    "type": "preTaskExecution"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Initiate automated team discussion for this task. Route to appropriate agents based on context, collect feedback in parallel, calculate consensus, and proceed if >80% agreement."
  }
}
```

## Monitoring & Observability

### Key Metrics

- Discussion Initiation Rate: discussions/hour
- Agent Response Time: avg ms per agent
- Consensus Rate: % reaching consensus
- Escalation Rate: % requiring human intervention
- Circular Dependency Detection: count/hour
- Timeout Rate: % timing out

## Security

### Message Validation

```typescript
function validateMessage(msg: AgentMessage): boolean {
  return (
    msg.id && 
    msg.from && 
    msg.type && 
    msg.timestamp &&
    Date.now() - msg.timestamp < 60000
  );
}
```

### Agent Authentication

```typescript
interface AgentIdentity {
  role: AgentRole;
  signature: string;
  timestamp: number;
}
```

---

**Implementation Status:** Design Complete ✅  
**Next Steps:** Implement consensus engine and decision recording
