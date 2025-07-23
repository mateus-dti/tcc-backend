import { api } from './config';
import type { 
  Model, 
  ModelsResponse, 
  ChatResponse,
  ConversationResponse,
  StartSessionResponse,
  SessionChatResponse,
  SessionHistoryResponse
} from '../../types/chat';
import type { Session } from '../../types/session';
import type { ChatUsage } from '../../types/api';

export class ChatService {
  // Buscar modelos disponíveis
  async getModels(): Promise<Model[]> {
    try {
      const response = await api.get<ModelsResponse>('/api/chat/models');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar modelos:', error);
      throw new Error('Falha ao carregar modelos disponíveis');
    }
  }

  // Enviar mensagem simples
  async sendMessage(modelId: string, message: string): Promise<string> {
    try {
      const response = await api.post<ChatResponse>('/api/chat/message', {
        modelId,
        message
      });
      
      if (response.data.success) {
        return response.data.data.response;
      } else {
        throw new Error(response.data.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
      throw new Error(errorMessage);
    }
  }

  // Enviar mensagem com contexto de conversa
  async sendConversationMessage(modelId: string, message: string, context?: string[]): Promise<{
    response: string;
    updatedContext: string[];
  }> {
    try {
      const response = await api.post<ConversationResponse>('/api/chat/conversation', {
        modelId,
        message,
        context
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem com contexto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
      throw new Error(errorMessage);
    }
  }

  // Iniciar nova sessão de chat
  async startChatSession(title?: string, modelId?: string, initialMessage?: string): Promise<{
    session: Session;
    firstMessage?: import('../../types/chat').ChatMessageResponse;
  }> {
    try {
      const response = await api.post<StartSessionResponse>('/api/chat/session/start', {
        title,
        modelId,
        initialMessage
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erro ao iniciar sessão');
      }
    } catch (error) {
      console.error('Erro ao iniciar sessão de chat:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao iniciar sessão de chat';
      throw new Error(errorMessage);
    }
  }

  // Enviar mensagem em uma sessão específica
  async sendSessionMessage(sessionId: string, message: string, modelId?: string): Promise<{
    sessionId: string;
    message: import('../../types/chat').ChatMessageResponse;
    usage?: ChatUsage;
    model: string;
  }> {
    try {
      const response = await api.post<SessionChatResponse>('/api/chat/session', {
        sessionId,
        message,
        modelId
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erro ao enviar mensagem na sessão');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem na sessão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar mensagem na sessão';
      throw new Error(errorMessage);
    }
  }

  // Buscar histórico de uma sessão
  async getSessionHistory(sessionId: string, limit?: number, offset?: number): Promise<{
    session: Session;
    messages: import('../../types/chat').ChatMessageResponse[];
    pagination: {
      limit: number;
      offset: number;
      count: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const response = await api.get<SessionHistoryResponse>(`/api/chat/session/${sessionId}/history?${params.toString()}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erro ao buscar histórico da sessão');
      }
    } catch (error) {
      console.error('Erro ao buscar histórico da sessão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar histórico da sessão';
      throw new Error(errorMessage);
    }
  }
}

// Instância singleton do serviço
export const chatService = new ChatService();
