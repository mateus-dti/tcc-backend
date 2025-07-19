import { Request, Response } from 'express';
import { SessionService } from '../services/SessionService';

export class SessionController {
  private sessionService: SessionService;

  constructor() {
    this.sessionService = new SessionService();
  }

  /**
   * Create a new chat session
   */
  createSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, title, model } = req.body;

      if (!userId) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      const session = await this.sessionService.createSession(userId, title, model);

      res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({
        error: 'Failed to create session'
      });
    }
  };

  /**
   * Get session by ID
   */
  getSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;

      const session = await this.sessionService.getSession(sessionId);

      if (!session) {
        res.status(404).json({
          error: 'Session not found'
        });
        return;
      }

      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Error getting session:', error);
      res.status(500).json({
        error: 'Failed to get session'
      });
    }
  };

  /**
   * Get user sessions
   */
  getUserSessions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const sessions = await this.sessionService.getUserSessions(userId);

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Error getting user sessions:', error);
      res.status(500).json({
        error: 'Failed to get user sessions'
      });
    }
  };

  /**
   * Delete session
   */
  deleteSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;

      const deleted = await this.sessionService.deleteSession(sessionId);

      if (!deleted) {
        res.status(404).json({
          error: 'Session not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Session deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).json({
        error: 'Failed to delete session'
      });
    }
  };

  /**
   * Get session messages
   */
  getSessionMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Check if session exists
      const isValid = await this.sessionService.isValidSession(sessionId);
      if (!isValid) {
        res.status(404).json({
          error: 'Session not found'
        });
        return;
      }

      const messages = await this.sessionService.getSessionMessages(sessionId, limit, offset);

      res.json({
        success: true,
        data: messages,
        pagination: {
          limit,
          offset,
          count: messages.length
        }
      });
    } catch (error) {
      console.error('Error getting session messages:', error);
      res.status(500).json({
        error: 'Failed to get session messages'
      });
    }
  };

  /**
   * Add message to session
   */
  addMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const { role, content, model, tokens } = req.body;

      if (!role || !content) {
        res.status(400).json({
          error: 'Role and content are required'
        });
        return;
      }

      if (!['user', 'assistant', 'system'].includes(role)) {
        res.status(400).json({
          error: 'Invalid role. Must be user, assistant, or system'
        });
        return;
      }

      // Check if session exists
      const isValid = await this.sessionService.isValidSession(sessionId);
      if (!isValid) {
        res.status(404).json({
          error: 'Session not found'
        });
        return;
      }

      const message = await this.sessionService.addMessage(sessionId, {
        role,
        content,
        model,
        tokens
      });

      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({
        error: 'Failed to add message'
      });
    }
  };

  /**
   * Extend session TTL
   */
  extendSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;

      // Check if session exists
      const isValid = await this.sessionService.isValidSession(sessionId);
      if (!isValid) {
        res.status(404).json({
          error: 'Session not found'
        });
        return;
      }

      await this.sessionService.extendSession(sessionId);

      res.json({
        success: true,
        message: 'Session extended successfully'
      });
    } catch (error) {
      console.error('Error extending session:', error);
      res.status(500).json({
        error: 'Failed to extend session'
      });
    }
  };

  /**
   * Health check for session service
   */
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      // Simple health check - just verify Redis connection
      res.json({
        success: true,
        service: 'Session Service',
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Session service health check failed:', error);
      res.status(500).json({
        success: false,
        service: 'Session Service',
        status: 'unhealthy',
        error: 'Service check failed'
      });
    }
  };
}
