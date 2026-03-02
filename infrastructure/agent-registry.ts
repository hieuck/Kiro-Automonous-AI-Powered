/**
 * Agent Registry
 * Dynamic agent discovery and capability mapping
 * 
 * @version 1.0.0
 * @status Active
 */

import { AgentRole } from './message-bus';

export type DecisionDomain = 
  | 'business-decision'
  | 'technical-decision'
  | 'architecture-decision'
  | 'quality-decision'
  | 'deployment-decision';

export type AgentStatus = 'active' | 'busy' | 'offline';

export interface AgentCapability {
  role: AgentRole;
  expertise: string[];
  decisionDomains: DecisionDomain[];
  availability: AgentStatus;
  responseTimeAvg: number; // milliseconds
  successRate: number; // 0-1
  lastActive: number; // timestamp
}

export interface AgentMetrics {
  totalInvocations: number;
  successfulInvocations: number;
  failedInvocations: number;
  avgResponseTime: number;
  lastInvocationTime: number;
}

/**
 * Agent Registry
 * Manages agent capabilities and availability
 */
export class AgentRegistry {
  private agents: Map<AgentRole, AgentCapability> = new Map();
  private metrics: Map<AgentRole, AgentMetrics> = new Map();

  constructor() {
    this.initializeAgents();
  }

  /**
   * Register agent with capabilities
   */
  register(capability: AgentCapability): void {
    this.agents.set(capability.role, capability);
    
    if (!this.metrics.has(capability.role)) {
      this.metrics.set(capability.role, {
        totalInvocations: 0,
        successfulInvocations: 0,
        failedInvocations: 0,
        avgResponseTime: 0,
        lastInvocationTime: 0
      });
    }
  }

  /**
   * Get agent capability
   */
  getAgent(role: AgentRole): AgentCapability | undefined {
    return this.agents.get(role);
  }

  /**
   * Get all agents
   */
  getAllAgents(): AgentCapability[] {
    return Array.from(this.agents.values());
  }

  /**
   * Find agents by expertise
   */
  findByExpertise(expertise: string): AgentCapability[] {
    return this.getAllAgents().filter(agent =>
      agent.expertise.some(e => e.toLowerCase().includes(expertise.toLowerCase()))
    );
  }

  /**
   * Find agents by decision domain
   */
  findByDecisionDomain(domain: DecisionDomain): AgentCapability[] {
    return this.getAllAgents().filter(agent =>
      agent.decisionDomains.includes(domain)
    );
  }

  /**
   * Get available agents
   */
  getAvailableAgents(): AgentCapability[] {
    return this.getAllAgents().filter(agent => agent.availability === 'active');
  }

  /**
   * Update agent status
   */
  updateStatus(role: AgentRole, status: AgentStatus): void {
    const agent = this.agents.get(role);
    if (agent) {
      agent.availability = status;
      agent.lastActive = Date.now();
    }
  }

  /**
   * Record invocation
   */
  recordInvocation(
    role: AgentRole,
    success: boolean,
    responseTime: number
  ): void {
    const metrics = this.metrics.get(role);
    if (!metrics) return;

    metrics.totalInvocations++;
    if (success) {
      metrics.successfulInvocations++;
    } else {
      metrics.failedInvocations++;
    }

    // Update average response time
    const totalTime = metrics.avgResponseTime * (metrics.totalInvocations - 1);
    metrics.avgResponseTime = (totalTime + responseTime) / metrics.totalInvocations;
    metrics.lastInvocationTime = Date.now();

    // Update agent capability
    const agent = this.agents.get(role);
    if (agent) {
      agent.responseTimeAvg = metrics.avgResponseTime;
      agent.successRate = metrics.successfulInvocations / metrics.totalInvocations;
    }
  }

  /**
   * Get agent metrics
   */
  getMetrics(role: AgentRole): AgentMetrics | undefined {
    return this.metrics.get(role);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<AgentRole, AgentMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Reset metrics
   */
  resetMetrics(role?: AgentRole): void {
    if (role) {
      this.metrics.set(role, {
        totalInvocations: 0,
        successfulInvocations: 0,
        failedInvocations: 0,
        avgResponseTime: 0,
        lastInvocationTime: 0
      });
    } else {
      for (const role of this.metrics.keys()) {
        this.resetMetrics(role);
      }
    }
  }

  // Private methods

  private initializeAgents(): void {
    // Product Owner
    this.register({
      role: 'product-owner',
      expertise: ['requirements', 'prioritization', 'business-value', 'user-stories', 'backlog-management'],
      decisionDomains: ['business-decision'],
      availability: 'active',
      responseTimeAvg: 0,
      successRate: 1.0,
      lastActive: Date.now()
    });

    // Tech Lead
    this.register({
      role: 'tech-lead',
      expertise: ['architecture', 'technical-design', 'code-review', 'technical-decisions', 'system-design'],
      decisionDomains: ['technical-decision', 'architecture-decision'],
      availability: 'active',
      responseTimeAvg: 0,
      successRate: 1.0,
      lastActive: Date.now()
    });

    // Developer
    this.register({
      role: 'developer',
      expertise: ['implementation', 'coding', 'debugging', 'optimization', 'refactoring'],
      decisionDomains: ['technical-decision'],
      availability: 'active',
      responseTimeAvg: 0,
      successRate: 1.0,
      lastActive: Date.now()
    });

    // QA Engineer
    this.register({
      role: 'qa-engineer',
      expertise: ['testing', 'quality-assurance', 'validation', 'test-automation', 'bug-detection'],
      decisionDomains: ['quality-decision'],
      availability: 'active',
      responseTimeAvg: 0,
      successRate: 1.0,
      lastActive: Date.now()
    });

    // DevOps Engineer
    this.register({
      role: 'devops-engineer',
      expertise: ['deployment', 'infrastructure', 'monitoring', 'ci-cd', 'automation'],
      decisionDomains: ['deployment-decision'],
      availability: 'active',
      responseTimeAvg: 0,
      successRate: 1.0,
      lastActive: Date.now()
    });
  }
}

/**
 * Singleton instance
 */
export const agentRegistry = new AgentRegistry();
