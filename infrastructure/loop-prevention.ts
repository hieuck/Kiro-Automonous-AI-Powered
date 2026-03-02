/**
 * Loop Prevention System
 * Detects and prevents circular dependencies in agent discussions
 * 
 * @version 1.0.0
 * @status Active
 */

import { AgentRole } from './message-bus';

export interface InvocationRecord {
  discussionId: string;
  agent: AgentRole;
  timestamp: number;
  depth: number;
}

export interface CircularDependency {
  detected: boolean;
  cycle: AgentRole[];
  depth: number;
}

/**
 * Discussion Tracker
 * Tracks agent invocations to detect circular dependencies
 */
export class DiscussionTracker {
  private invocationChains: Map<string, InvocationRecord[]> = new Map();
  private readonly MAX_DEPTH = 10;
  private readonly MAX_SAME_AGENT = 3;
  private readonly CLEANUP_INTERVAL = 3600000; // 1 hour
  
  constructor() {
    // Periodic cleanup of old discussions
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  /**
   * Record agent invocation
   */
  recordInvocation(discussionId: string, agent: AgentRole): void {
    if (!this.invocationChains.has(discussionId)) {
      this.invocationChains.set(discussionId, []);
    }
    
    const chain = this.invocationChains.get(discussionId)!;
    const depth = chain.length;
    
    chain.push({
      discussionId,
      agent,
      timestamp: Date.now(),
      depth
    });
  }

  /**
   * Detect circular dependency
   */
  detectCircular(discussionId: string, agent: AgentRole): CircularDependency {
    const chain = this.invocationChains.get(discussionId) || [];
    
    // Check if agent already in chain (circular)
    const agentIndices = chain
      .map((record, index) => ({ agent: record.agent, index }))
      .filter(item => item.agent === agent)
      .map(item => item.index);
    
    if (agentIndices.length > 0) {
      // Found circular dependency
      const lastIndex = agentIndices[agentIndices.length - 1];
      const cycle = chain.slice(lastIndex).map(r => r.agent);
      cycle.push(agent); // Complete the cycle
      
      return {
        detected: true,
        cycle,
        depth: chain.length
      };
    }
    
    return {
      detected: false,
      cycle: [],
      depth: chain.length
    };
  }

  /**
   * Check if depth limit exceeded
   */
  isDepthExceeded(discussionId: string): boolean {
    const chain = this.invocationChains.get(discussionId) || [];
    return chain.length >= this.MAX_DEPTH;
  }

  /**
   * Check if same agent invoked too many times
   */
  isSameAgentExceeded(discussionId: string, agent: AgentRole): boolean {
    const chain = this.invocationChains.get(discussionId) || [];
    const count = chain.filter(r => r.agent === agent).length;
    return count >= this.MAX_SAME_AGENT;
  }

  /**
   * Get invocation chain
   */
  getChain(discussionId: string): InvocationRecord[] {
    return [...(this.invocationChains.get(discussionId) || [])];
  }

  /**
   * Get chain depth
   */
  getDepth(discussionId: string): number {
    return (this.invocationChains.get(discussionId) || []).length;
  }

  /**
   * Clear discussion chain
   */
  clearChain(discussionId: string): void {
    this.invocationChains.delete(discussionId);
  }

  /**
   * Get all active discussions
   */
  getActiveDiscussions(): string[] {
    return Array.from(this.invocationChains.keys());
  }

  /**
   * Get discussion statistics
   */
  getStatistics(discussionId: string): {
    totalInvocations: number;
    uniqueAgents: number;
    agentCounts: Map<AgentRole, number>;
    duration: number;
  } {
    const chain = this.invocationChains.get(discussionId) || [];
    
    if (chain.length === 0) {
      return {
        totalInvocations: 0,
        uniqueAgents: 0,
        agentCounts: new Map(),
        duration: 0
      };
    }
    
    const agentCounts = new Map<AgentRole, number>();
    for (const record of chain) {
      agentCounts.set(record.agent, (agentCounts.get(record.agent) || 0) + 1);
    }
    
    const duration = chain[chain.length - 1].timestamp - chain[0].timestamp;
    
    return {
      totalInvocations: chain.length,
      uniqueAgents: agentCounts.size,
      agentCounts,
      duration
    };
  }

  /**
   * Cleanup old discussions
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 3600000; // 1 hour
    
    for (const [discussionId, chain] of this.invocationChains.entries()) {
      if (chain.length === 0) {
        this.invocationChains.delete(discussionId);
        continue;
      }
      
      const lastTimestamp = chain[chain.length - 1].timestamp;
      if (now - lastTimestamp > maxAge) {
        this.invocationChains.delete(discussionId);
      }
    }
  }
}

/**
 * Timeout Manager
 * Manages timeouts for agent invocations and discussions
 */
export class TimeoutManager {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();
  
  readonly AGENT_RESPONSE_TIMEOUT = 30000; // 30s
  readonly DISCUSSION_ROUND_TIMEOUT = 60000; // 1min
  readonly TOTAL_DISCUSSION_TIMEOUT = 300000; // 5min
  readonly CONSENSUS_WAIT_TIMEOUT = 10000; // 10s

  /**
   * Set timeout for operation
   */
  setTimeout(
    id: string,
    callback: () => void,
    duration: number
  ): void {
    // Clear existing timeout
    this.clearTimeout(id);
    
    // Set new timeout
    const timeout = setTimeout(() => {
      callback();
      this.timeouts.delete(id);
    }, duration);
    
    this.timeouts.set(id, timeout);
  }

  /**
   * Clear timeout
   */
  clearTimeout(id: string): void {
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }
  }

  /**
   * Clear all timeouts
   */
  clearAll(): void {
    for (const timeout of this.timeouts.values()) {
      clearTimeout(timeout);
    }
    this.timeouts.clear();
  }

  /**
   * Check if timeout exists
   */
  hasTimeout(id: string): boolean {
    return this.timeouts.has(id);
  }

  /**
   * Get active timeout count
   */
  getActiveCount(): number {
    return this.timeouts.size;
  }
}

/**
 * Singleton instances
 */
export const discussionTracker = new DiscussionTracker();
export const timeoutManager = new TimeoutManager();
