/**
 * Message Bus Implementation
 * In-memory event-driven message bus for agent communication
 * 
 * @version 1.0.0
 * @status Active
 */

export type AgentRole = 
  | 'product-owner'
  | 'tech-lead'
  | 'developer'
  | 'qa-engineer'
  | 'devops-engineer';

export type MessageType = 
  | 'proposal'
  | 'feedback'
  | 'vote'
  | 'decision'
  | 'query'
  | 'response';

export interface AgentMessage {
  id: string;
  correlationId: string;
  from: AgentRole;
  to: AgentRole | 'broadcast';
  type: MessageType;
  content: any;
  timestamp: number;
  metadata: {
    taskId?: string;
    discussionId: string;
    round: number;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface MessageHandler {
  (message: AgentMessage): void | Promise<void>;
}

export interface Subscription {
  id: string;
  agent: AgentRole;
  handler: MessageHandler;
  filter?: (message: AgentMessage) => boolean;
}

/**
 * In-Memory Message Bus
 * Pub/Sub pattern for agent communication
 */
export class MessageBus {
  private subscriptions: Map<string, Subscription[]> = new Map();
  private messageHistory: AgentMessage[] = [];
  private readonly MAX_HISTORY = 1000;

  /**
   * Subscribe to messages
   */
  subscribe(
    agent: AgentRole,
    handler: MessageHandler,
    filter?: (message: AgentMessage) => boolean
  ): string {
    const subscriptionId = this.generateId();
    const subscription: Subscription = {
      id: subscriptionId,
      agent,
      handler,
      filter
    };

    // Subscribe to agent-specific channel
    const agentChannel = `agent.${agent}`;
    if (!this.subscriptions.has(agentChannel)) {
      this.subscriptions.set(agentChannel, []);
    }
    this.subscriptions.get(agentChannel)!.push(subscription);

    // Subscribe to broadcast channel
    const broadcastChannel = 'team.broadcast';
    if (!this.subscriptions.has(broadcastChannel)) {
      this.subscriptions.set(broadcastChannel, []);
    }
    this.subscriptions.get(broadcastChannel)!.push(subscription);

    return subscriptionId;
  }

  /**
   * Unsubscribe from messages
   */
  unsubscribe(subscriptionId: string): void {
    for (const [channel, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        if (subs.length === 0) {
          this.subscriptions.delete(channel);
        }
      }
    }
  }

  /**
   * Publish message to channel
   */
  async publish(message: AgentMessage): Promise<void> {
    // Validate message
    if (!this.validateMessage(message)) {
      throw new Error('Invalid message format');
    }

    // Add to history
    this.addToHistory(message);

    // Determine target channel
    const channel = message.to === 'broadcast' 
      ? 'team.broadcast'
      : `agent.${message.to}`;

    // Get subscribers
    const subscribers = this.subscriptions.get(channel) || [];

    // Deliver to subscribers
    const deliveryPromises = subscribers
      .filter(sub => !sub.filter || sub.filter(message))
      .map(sub => this.deliverMessage(sub, message));

    await Promise.allSettled(deliveryPromises);
  }

  /**
   * Get message history
   */
  getHistory(filter?: {
    discussionId?: string;
    from?: AgentRole;
    to?: AgentRole;
    type?: MessageType;
    since?: number;
  }): AgentMessage[] {
    let history = [...this.messageHistory];

    if (filter) {
      if (filter.discussionId) {
        history = history.filter(m => m.metadata.discussionId === filter.discussionId);
      }
      if (filter.from) {
        history = history.filter(m => m.from === filter.from);
      }
      if (filter.to) {
        history = history.filter(m => m.to === filter.to);
      }
      if (filter.type) {
        history = history.filter(m => m.type === filter.type);
      }
      if (filter.since) {
        history = history.filter(m => m.timestamp >= filter.since);
      }
    }

    return history;
  }

  /**
   * Clear message history
   */
  clearHistory(): void {
    this.messageHistory = [];
  }

  /**
   * Get active subscriptions count
   */
  getSubscriptionCount(): number {
    let count = 0;
    for (const subs of this.subscriptions.values()) {
      count += subs.length;
    }
    return count;
  }

  // Private methods

  private validateMessage(message: AgentMessage): boolean {
    return !!(
      message.id &&
      message.from &&
      message.to &&
      message.type &&
      message.timestamp &&
      message.metadata?.discussionId &&
      typeof message.metadata.round === 'number' &&
      Date.now() - message.timestamp < 60000 // Not older than 1 minute
    );
  }

  private addToHistory(message: AgentMessage): void {
    this.messageHistory.push(message);
    
    // Trim history if too large
    if (this.messageHistory.length > this.MAX_HISTORY) {
      this.messageHistory = this.messageHistory.slice(-this.MAX_HISTORY);
    }
  }

  private async deliverMessage(
    subscription: Subscription,
    message: AgentMessage
  ): Promise<void> {
    try {
      await subscription.handler(message);
    } catch (error) {
      console.error(`Error delivering message to ${subscription.agent}:`, error);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Singleton instance
 */
export const messageBus = new MessageBus();
