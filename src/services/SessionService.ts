import { v4 as uuidv4 } from 'uuid';
import { RedisConfig } from '../config/redis';

export interface ChatSession {
  id: string;
  userId: string;
  createdAt: Date;
  lastActivity: Date;
  messageCount: number;
  title?: string;
  model?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export class SessionService {
  private redis = RedisConfig.getInstance();
  private sessionTTL: number;
  private maxSessionsPerUser: number;
  private maxMessagesPerSession: number;

  constructor() {
    this.sessionTTL = parseInt(process.env.SESSION_TTL || '3600'); // 1 hour default
    this.maxSessionsPerUser = parseInt(process.env.MAX_SESSIONS_PER_USER || '5');
    this.maxMessagesPerSession = parseInt(process.env.MAX_MESSAGES_PER_SESSION || '100');
  }

  /**
   * Create a new chat session
   */
  async createSession(userId: string, title?: string, model?: string): Promise<ChatSession> {
    try {
      // Ensure Redis is connected before performing operations
      await this.ensureConnection();

      const sessionId = uuidv4();
      const now = new Date();

      const session: ChatSession = {
        id: sessionId,
        userId,
        createdAt: now,
        lastActivity: now,
        messageCount: 0,
        title: title || `Chat Session ${now.toISOString()}`,
        model
      };

      const client = this.redis.getClient();
      
      // Store session data
      const sessionKey = `session:${sessionId}`;
      await client.hSet(sessionKey, {
        id: sessionId,
        userId,
        createdAt: now.toISOString(),
        lastActivity: now.toISOString(),
        messageCount: '0',
        title: session.title || '',
        model: model || ''
      });

      // Set TTL for session
      await client.expire(sessionKey, this.sessionTTL);

      // Add session to user's session list
      const userSessionsKey = `user:${userId}:sessions`;
      await client.lPush(userSessionsKey, sessionId);
      await client.expire(userSessionsKey, this.sessionTTL);

      // Limit number of sessions per user
      await this.limitUserSessions(userId);

      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.redis.isClientConnected()) {
      await this.redis.connect();
    }
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    const client = this.redis.getClient();
    const sessionKey = `session:${sessionId}`;
    
    const sessionData = await client.hGetAll(sessionKey);
    
    if (!sessionData || Object.keys(sessionData).length === 0) {
      return null;
    }

    return {
      id: sessionData.id,
      userId: sessionData.userId,
      createdAt: new Date(sessionData.createdAt),
      lastActivity: new Date(sessionData.lastActivity),
      messageCount: parseInt(sessionData.messageCount || '0'),
      title: sessionData.title,
      model: sessionData.model || undefined
    };
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(sessionId: string): Promise<void> {
    const client = this.redis.getClient();
    const sessionKey = `session:${sessionId}`;
    
    await client.hSet(sessionKey, 'lastActivity', new Date().toISOString());
    await client.expire(sessionKey, this.sessionTTL);
  }

  /**
   * Add message to session
   */
  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'sessionId' | 'timestamp'>): Promise<ChatMessage> {
    const messageId = uuidv4();
    const timestamp = new Date();

    const chatMessage: ChatMessage = {
      id: messageId,
      sessionId,
      timestamp,
      ...message
    };

    const client = this.redis.getClient();
    
    // Store message
    const messageKey = `message:${messageId}`;
    await client.hSet(messageKey, {
      id: messageId,
      sessionId,
      role: message.role,
      content: message.content,
      timestamp: timestamp.toISOString(),
      model: message.model || '',
      promptTokens: message.tokens?.prompt?.toString() || '0',
      completionTokens: message.tokens?.completion?.toString() || '0',
      totalTokens: message.tokens?.total?.toString() || '0'
    });

    // Set TTL for message
    await client.expire(messageKey, this.sessionTTL);

    // Add message to session's message list
    const sessionMessagesKey = `session:${sessionId}:messages`;
    await client.lPush(sessionMessagesKey, messageId);
    await client.expire(sessionMessagesKey, this.sessionTTL);

    // Update session message count
    const sessionKey = `session:${sessionId}`;
    await client.hIncrBy(sessionKey, 'messageCount', 1);

    // Update session activity
    await this.updateSessionActivity(sessionId);

    // Limit messages per session
    await this.limitSessionMessages(sessionId);

    return chatMessage;
  }

  /**
   * Get messages from session
   */
  async getSessionMessages(sessionId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    const client = this.redis.getClient();
    const sessionMessagesKey = `session:${sessionId}:messages`;
    
    // Get message IDs (reversed to get newest first)
    const messageIds = await client.lRange(sessionMessagesKey, offset, offset + limit - 1);
    
    if (!messageIds || messageIds.length === 0) {
      return [];
    }

    // Get message details
    const messages: ChatMessage[] = [];
    
    for (const messageId of messageIds.reverse()) { // Reverse to get chronological order
      const messageKey = `message:${messageId}`;
      const messageData = await client.hGetAll(messageKey);
      
      if (messageData && Object.keys(messageData).length > 0) {
        messages.push({
          id: messageData.id,
          sessionId: messageData.sessionId,
          role: messageData.role as 'user' | 'assistant' | 'system',
          content: messageData.content,
          timestamp: new Date(messageData.timestamp),
          model: messageData.model || undefined,
          tokens: {
            prompt: parseInt(messageData.promptTokens || '0'),
            completion: parseInt(messageData.completionTokens || '0'),
            total: parseInt(messageData.totalTokens || '0')
          }
        });
      }
    }

    return messages;
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    const client = this.redis.getClient();
    const userSessionsKey = `user:${userId}:sessions`;
    
    const sessionIds = await client.lRange(userSessionsKey, 0, -1);
    
    if (!sessionIds || sessionIds.length === 0) {
      return [];
    }

    const sessions: ChatSession[] = [];
    
    for (const sessionId of sessionIds) {
      const session = await this.getSession(sessionId);
      if (session) {
        sessions.push(session);
      }
    }

    // Sort by last activity (newest first)
    return sessions.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    const client = this.redis.getClient();
    
    // Get session to find userId
    const session = await this.getSession(sessionId);
    if (!session) {
      return false;
    }

    // Delete all messages
    const sessionMessagesKey = `session:${sessionId}:messages`;
    const messageIds = await client.lRange(sessionMessagesKey, 0, -1);
    
    for (const messageId of messageIds) {
      await client.del(`message:${messageId}`);
    }

    // Delete session messages list
    await client.del(sessionMessagesKey);

    // Delete session
    const sessionKey = `session:${sessionId}`;
    await client.del(sessionKey);

    // Remove from user's session list
    const userSessionsKey = `user:${session.userId}:sessions`;
    await client.lRem(userSessionsKey, 1, sessionId);

    return true;
  }

  /**
   * Clear old sessions for user (keep only max allowed)
   */
  private async limitUserSessions(userId: string): Promise<void> {
    const client = this.redis.getClient();
    const userSessionsKey = `user:${userId}:sessions`;
    
    const sessionCount = await client.lLen(userSessionsKey);
    
    if (sessionCount > this.maxSessionsPerUser) {
      // Get oldest sessions to remove
      const sessionsToRemove = await client.lRange(
        userSessionsKey, 
        this.maxSessionsPerUser, 
        -1
      );
      
      // Delete old sessions
      for (const sessionId of sessionsToRemove) {
        await this.deleteSession(sessionId);
      }
      
      // Trim the list
      await client.lTrim(userSessionsKey, 0, this.maxSessionsPerUser - 1);
    }
  }

  /**
   * Limit messages per session
   */
  private async limitSessionMessages(sessionId: string): Promise<void> {
    const client = this.redis.getClient();
    const sessionMessagesKey = `session:${sessionId}:messages`;
    
    const messageCount = await client.lLen(sessionMessagesKey);
    
    if (messageCount > this.maxMessagesPerSession) {
      // Get oldest messages to remove
      const messagesToRemove = await client.lRange(
        sessionMessagesKey,
        this.maxMessagesPerSession,
        -1
      );
      
      // Delete old messages
      for (const messageId of messagesToRemove) {
        await client.del(`message:${messageId}`);
      }
      
      // Trim the list
      await client.lTrim(sessionMessagesKey, 0, this.maxMessagesPerSession - 1);
    }
  }

  /**
   * Check if session exists and is valid
   */
  async isValidSession(sessionId: string): Promise<boolean> {
    const client = this.redis.getClient();
    const sessionKey = `session:${sessionId}`;
    return await client.exists(sessionKey) === 1;
  }

  /**
   * Extend session TTL
   */
  async extendSession(sessionId: string): Promise<void> {
    const client = this.redis.getClient();
    const sessionKey = `session:${sessionId}`;
    await client.expire(sessionKey, this.sessionTTL);
    
    // Also extend related keys
    const sessionMessagesKey = `session:${sessionId}:messages`;
    await client.expire(sessionMessagesKey, this.sessionTTL);
  }
}
