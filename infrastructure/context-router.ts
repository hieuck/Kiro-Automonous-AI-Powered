/**
 * Context-Aware Agent Router
 * Automatically determines which agents to involve based on task context
 * 
 * @version 1.0.0
 * @status Active
 */

import { AgentRole } from './message-bus';
import { DecisionDomain, agentRegistry } from './agent-registry';

export interface TaskContext {
  taskId: string;
  type: string;
  description: string;
  complexity: number; // 0-100
  riskScore: number; // 0-100
  impactScore: number; // 0-100
  domains: string[];
  keywords: string[];
  breakingChange?: boolean;
  securityCritical?: boolean;
}

export interface RoutingDecision {
  agents: AgentRole[];
  reasoning: string;
  confidence: number; // 0-1
  decisionDomain: DecisionDomain;
}

/**
 * Context-Aware Router
 * Routes tasks to appropriate agents based on context analysis
 */
export class ContextRouter {
  /**
   * Route task to appropriate agents
   */
  route(context: TaskContext): RoutingDecision {
    const agents = new Set<AgentRole>();
    const reasons: string[] = [];
    
    // Complexity-based routing
    if (context.complexity > 70) {
      agents.add('tech-lead');
      reasons.push('High complexity requires Tech Lead oversight');
    }
    
    // Risk-based routing
    if (context.riskScore > 60) {
      agents.add('product-owner');
      agents.add('tech-lead');
      reasons.push('High risk requires Product Owner and Tech Lead approval');
    }
    
    // Impact-based routing
    if (context.impactScore > 70) {
      agents.add('product-owner');
      reasons.push('High business impact requires Product Owner input');
    }
    
    // Domain-based routing
    const domainAgents = this.routeByDomain(context.domains);
    domainAgents.forEach(agent => agents.add(agent));
    if (domainAgents.length > 0) {
      reasons.push(`Domain expertise: ${context.domains.join(', ')}`);
    }
    
    // Keyword-based routing
    const keywordAgents = this.routeByKeywords(context.keywords);
    keywordAgents.forEach(agent => agents.add(agent));
    if (keywordAgents.length > 0) {
      reasons.push(`Keyword match: ${context.keywords.join(', ')}`);
    }
    
    // Security-critical routing
    if (context.securityCritical) {
      agents.add('tech-lead');
      agents.add('devops-engineer');
      reasons.push('Security-critical task requires Tech Lead and DevOps');
    }
    
    // Breaking change routing
    if (context.breakingChange) {
      agents.add('product-owner');
      agents.add('tech-lead');
      reasons.push('Breaking change requires Product Owner and Tech Lead approval');
    }
    
    // Always include developer for implementation
    agents.add('developer');
    
    // Always include QA for quality assurance
    agents.add('qa-engineer');
    
    // Determine decision domain
    const decisionDomain = this.determineDecisionDomain(context);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(context, Array.from(agents));
    
    return {
      agents: Array.from(agents),
      reasoning: reasons.join('; '),
      confidence,
      decisionDomain
    };
  }

  /**
   * Route by domain expertise
   */
  private routeByDomain(domains: string[]): AgentRole[] {
    const agents = new Set<AgentRole>();
    
    for (const domain of domains) {
      const domainLower = domain.toLowerCase();
      
      if (domainLower.includes('architecture') || domainLower.includes('design')) {
        agents.add('tech-lead');
      }
      if (domainLower.includes('test') || domainLower.includes('quality')) {
        agents.add('qa-engineer');
      }
      if (domainLower.includes('deploy') || domainLower.includes('infrastructure')) {
        agents.add('devops-engineer');
      }
      if (domainLower.includes('business') || domainLower.includes('requirement')) {
        agents.add('product-owner');
      }
      if (domainLower.includes('implementation') || domainLower.includes('code')) {
        agents.add('developer');
      }
    }
    
    return Array.from(agents);
  }

  /**
   * Route by keywords
   */
  private routeByKeywords(keywords: string[]): AgentRole[] {
    const agents = new Set<AgentRole>();
    
    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Architecture keywords
      if (['microservice', 'api', 'database', 'schema', 'pattern'].some(k => keywordLower.includes(k))) {
        agents.add('tech-lead');
      }
      
      // Testing keywords
      if (['test', 'coverage', 'validation', 'qa'].some(k => keywordLower.includes(k))) {
        agents.add('qa-engineer');
      }
      
      // Deployment keywords
      if (['deploy', 'ci', 'cd', 'docker', 'kubernetes'].some(k => keywordLower.includes(k))) {
        agents.add('devops-engineer');
      }
      
      // Business keywords
      if (['feature', 'user', 'story', 'requirement', 'priority'].some(k => keywordLower.includes(k))) {
        agents.add('product-owner');
      }
      
      // Implementation keywords
      if (['implement', 'code', 'function', 'class', 'refactor'].some(k => keywordLower.includes(k))) {
        agents.add('developer');
      }
    }
    
    return Array.from(agents);
  }

  /**
   * Determine decision domain
   */
  private determineDecisionDomain(context: TaskContext): DecisionDomain {
    // Business decision
    if (context.impactScore > 70 || context.breakingChange) {
      return 'business-decision';
    }
    
    // Architecture decision
    if (context.complexity > 70 || context.domains.some(d => d.toLowerCase().includes('architecture'))) {
      return 'architecture-decision';
    }
    
    // Quality decision
    if (context.domains.some(d => d.toLowerCase().includes('test') || d.toLowerCase().includes('quality'))) {
      return 'quality-decision';
    }
    
    // Deployment decision
    if (context.domains.some(d => d.toLowerCase().includes('deploy') || d.toLowerCase().includes('infrastructure'))) {
      return 'deployment-decision';
    }
    
    // Default to technical decision
    return 'technical-decision';
  }

  /**
   * Calculate routing confidence
   */
  private calculateConfidence(context: TaskContext, agents: AgentRole[]): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence if we have clear domain matches
    if (context.domains.length > 0) {
      confidence += 0.2;
    }
    
    // Increase confidence if we have keyword matches
    if (context.keywords.length > 0) {
      confidence += 0.1;
    }
    
    // Increase confidence if complexity/risk/impact are well-defined
    if (context.complexity > 0 && context.riskScore > 0 && context.impactScore > 0) {
      confidence += 0.1;
    }
    
    // Increase confidence if we have multiple agents (diverse perspectives)
    if (agents.length >= 3) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Get recommended agents for decision domain
   */
  getRecommendedAgents(domain: DecisionDomain): AgentRole[] {
    const agents = agentRegistry.findByDecisionDomain(domain);
    return agents.map(a => a.role);
  }

  /**
   * Validate routing decision
   */
  validateRouting(decision: RoutingDecision): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Must have at least 2 agents
    if (decision.agents.length < 2) {
      issues.push('Routing must include at least 2 agents for consensus');
    }
    
    // Must include developer for implementation
    if (!decision.agents.includes('developer')) {
      issues.push('Developer must be included for implementation');
    }
    
    // High-risk decisions must include tech-lead
    if (decision.decisionDomain === 'architecture-decision' && !decision.agents.includes('tech-lead')) {
      issues.push('Architecture decisions must include Tech Lead');
    }
    
    // Business decisions must include product-owner
    if (decision.decisionDomain === 'business-decision' && !decision.agents.includes('product-owner')) {
      issues.push('Business decisions must include Product Owner');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }
}

/**
 * Singleton instance
 */
export const contextRouter = new ContextRouter();
