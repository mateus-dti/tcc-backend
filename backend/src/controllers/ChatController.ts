import { Request, Response } from 'express';
import { getOpenRouterService, OpenRouterMessage } from '../services/OpenRouterService';
import { SessionService } from '../services/SessionService';

export class ChatController {
  private static sessionService = new SessionService();
  
  /**
   * GET /api/chat/models
   * Retorna todos os modelos disponíveis
   */
  static async getModels(req: Request, res: Response): Promise<void> {
    try {
      const openRouter = getOpenRouterService();
      const models = await openRouter.getModels();
      
      res.json({
        success: true,
        data: models,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch models'
      });
    }
  }

  /**
   * GET /api/chat/models/filtered
   * Retorna modelos filtrados por critérios
   */
  static async getFilteredModels(req: Request, res: Response): Promise<void> {
    try {
      const openRouter = getOpenRouterService();
      const {
        maxPrice,
        minContextLength,
        provider,
        search
      } = req.query;

      const filters = {
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        minContextLength: minContextLength ? parseInt(minContextLength as string) : undefined,
        provider: provider as string,
        search: search as string
      };

      const models = await openRouter.getFilteredModels(filters);
      
      res.json({
        success: true,
        data: models,
        count: models.length,
        filters
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch filtered models'
      });
    }
  }

  /**
   * POST /api/chat/message
   * Envia uma mensagem simples para um modelo
   * Corpo da requisição: { modelId: string, message: string }
   */
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { modelId, message } = req.body;

      if (!modelId || !message) {
        res.status(400).json({
          success: false,
          error: 'modelId and message are required'
        });
        return;
      }

      const openRouter = getOpenRouterService();
      const response = await openRouter.sendMessage(
        modelId,
        message,
        undefined, // sem system prompt
        {
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1.0
        }
      );

      res.json({
        success: true,
        data: {
          response,
          modelId,
          message
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to send message'
      });
    }
  }

  /**
   * POST /api/chat/conversation
   * Mantém uma conversa com contexto
   * Corpo da requisição: { modelId: string, message: string, context?: string[] }
   */
  static async conversationChat(req: Request, res: Response): Promise<void> {
    try {
      const { modelId, message, context } = req.body;

      if (!modelId || !message) {
        res.status(400).json({
          success: false,
          error: 'modelId and message are required'
        });
        return;
      }

      // Construir array de mensagens a partir do contexto
      const messages: OpenRouterMessage[] = [];
      
      // Adicionar contexto se fornecido
      if (context && Array.isArray(context)) {
        context.forEach((msg, index) => {
          messages.push({
            role: index % 2 === 0 ? 'user' : 'assistant',
            content: msg
          });
        });
      }
      
      // Adicionar mensagem atual
      messages.push({
        role: 'user',
        content: message
      });

      const openRouter = getOpenRouterService();
      const result = await openRouter.conversationChat(
        modelId,
        messages,
        {
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1.0
        }
      );

      res.json({
        success: true,
        data: {
          response: result.response,
          modelId,
          message,
          usage: result.usage,
          updatedContext: result.updatedMessages.map(msg => msg.content)
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process conversation'
      });
    }
  }

  /**
   * POST /api/chat/complete
   * Endpoint mais avançado com controle total sobre a requisição
   * Corpo da requisição: { modelId: string, message: string, options?: object }
   */
  static async chatCompletion(req: Request, res: Response): Promise<void> {
    try {
      const { modelId, message, options = {} } = req.body;

      if (!modelId || !message) {
        res.status(400).json({
          success: false,
          error: 'modelId and message are required'
        });
        return;
      }

      // Construir requisição para OpenRouter
      const requestBody = {
        model: modelId,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 1.0,
        ...options // permite override de qualquer opção
      };

      const openRouter = getOpenRouterService();
      const response = await openRouter.chat(requestBody);

      res.json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to complete chat'
      });
    }
  }

  /**
   * POST /api/chat/cost-estimate
   * Calcula o custo estimado para uma requisição
   * Corpo da requisição: { modelId: string, promptTokens: number, completionTokens: number }
   */
  static async calculateCost(req: Request, res: Response): Promise<void> {
    try {
      const {
        modelId,
        promptTokens,
        completionTokens
      } = req.body;

      if (!modelId || promptTokens === undefined || completionTokens === undefined) {
        res.status(400).json({
          success: false,
          error: 'modelId, promptTokens, and completionTokens are required'
        });
        return;
      }

      const openRouter = getOpenRouterService();
      const models = await openRouter.getModels();
      const model = models.find(m => m.id === modelId);

      if (!model) {
        res.status(404).json({
          success: false,
          error: 'Model not found'
        });
        return;
      }

      const cost = openRouter.calculateEstimatedCost(model, promptTokens, completionTokens);

      res.json({
        success: true,
        data: {
          model: model.name,
          modelId: model.id,
          cost,
          pricing: model.pricing
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to calculate cost'
      });
    }
  }

  /**
   * GET /api/chat/health
   * Verifica se a API do OpenRouter está funcionando
   */
  static async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const openRouter = getOpenRouterService();
      const isHealthy = await openRouter.healthCheck();

      res.json({
        success: true,
        data: {
          openRouterApi: isHealthy,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Health check failed'
      });
    }
  }

  /**
   * POST /api/chat/simple
   * Endpoint mais simples: apenas modelId e message
   * Corpo da requisição: { modelId: string, message: string }
   */
  static async simpleChat(req: Request, res: Response): Promise<void> {
    try {
      const { modelId, message } = req.body;

      if (!modelId || !message) {
        res.status(400).json({
          success: false,
          error: 'modelId and message are required'
        });
        return;
      }

      const openRouter = getOpenRouterService();
      const response = await openRouter.sendMessage(
        modelId,
        message
      );

      res.json({
        success: true,
        modelId,
        message,
        response
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to send message'
      });
    }
  }

  /**
   * POST /api/chat/session
   * Envia uma mensagem dentro de uma sessão específica
   * Corpo da requisição: { sessionId: string, message: string, modelId?: string }
   */
  static async sendSessionMessage(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, message, modelId } = req.body;

      if (!sessionId || !message) {
        res.status(400).json({
          success: false,
          error: 'sessionId and message are required'
        });
        return;
      }

      // Verificar se a sessão existe
      const session = await ChatController.sessionService.getSession(sessionId);
      if (!session) {
        res.status(404).json({
          success: false,
          error: 'Session not found'
        });
        return;
      }

      // Usar o modelo da sessão se não fornecido
      const useModel = modelId || session.model || 'openai/gpt-3.5-turbo';

      // Adicionar mensagem do usuário à sessão
      await ChatController.sessionService.addMessage(sessionId, {
        role: 'user',
        content: message,
        model: useModel
      });

      // Buscar histórico de mensagens para contexto
      const messages = await ChatController.sessionService.getSessionMessages(sessionId, 20);
      
      // Converter para formato OpenRouter
      const openRouterMessages: OpenRouterMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Enviar para OpenRouter
      const openRouter = getOpenRouterService();
      const result = await openRouter.conversationChat(
        useModel,
        openRouterMessages,
        {
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1.0
        }
      );

      // Adicionar resposta do assistente à sessão
      const assistantMessage = await ChatController.sessionService.addMessage(sessionId, {
        role: 'assistant',
        content: result.response,
        model: useModel,
        tokens: result.usage ? {
          prompt: result.usage.prompt_tokens,
          completion: result.usage.completion_tokens,
          total: result.usage.total_tokens
        } : undefined
      });

      res.json({
        success: true,
        data: {
          sessionId,
          message: assistantMessage,
          usage: result.usage,
          model: useModel
        }
      });
    } catch (error: any) {
      console.error('Error in session chat:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process session message'
      });
    }
  }

  /**
   * POST /api/chat/session/start
   * Inicia uma nova sessão de chat
   * Corpo da requisição: { userId: string, title?: string, modelId?: string, initialMessage?: string }
   */
  static async startChatSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId, title, modelId, initialMessage } = req.body;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'userId is required'
        });
        return;
      }

      // Criar nova sessão
      const session = await ChatController.sessionService.createSession(
        userId,
        title || 'New Chat Session',
        modelId || 'openai/gpt-3.5-turbo'
      );

      let firstMessage = null;

      // Se há mensagem inicial, processá-la
      if (initialMessage) {
        // Adicionar mensagem do usuário
        await ChatController.sessionService.addMessage(session.id, {
          role: 'user',
          content: initialMessage,
          model: session.model
        });

        // Gerar resposta
        const openRouter = getOpenRouterService();
        const response = await openRouter.sendMessage(
          session.model || 'openai/gpt-3.5-turbo',
          initialMessage,
          undefined,
          {
            maxTokens: 1000,
            temperature: 0.7,
            topP: 1.0
          }
        );

        // Adicionar resposta do assistente
        firstMessage = await ChatController.sessionService.addMessage(session.id, {
          role: 'assistant',
          content: response,
          model: session.model
        });
      }

      res.status(201).json({
        success: true,
        data: {
          session,
          firstMessage
        }
      });
    } catch (error: any) {
      console.error('Error starting chat session:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to start chat session'
      });
    }
  }

  /**
   * GET /api/chat/session/:sessionId/history
   * Busca o histórico de uma sessão
   */
  static async getSessionHistory(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Verificar se a sessão existe
      const session = await ChatController.sessionService.getSession(sessionId);
      if (!session) {
        res.status(404).json({
          success: false,
          error: 'Session not found'
        });
        return;
      }

      // Buscar mensagens
      const messages = await ChatController.sessionService.getSessionMessages(sessionId, limit, offset);

      res.json({
        success: true,
        data: {
          session,
          messages,
          pagination: {
            limit,
            offset,
            count: messages.length
          }
        }
      });
    } catch (error: any) {
      console.error('Error getting session history:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get session history'
      });
    }
  }
}
