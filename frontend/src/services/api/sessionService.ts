import { api } from './config';
import type { 
  Session, 
  CreateSessionRequest, 
  UpdateSessionRequest,
  SessionResponse,
  SessionsResponse
} from '../../types/session';

export class SessionService {
  // Criar nova sessão
  async createSession(userId: string, title?: string, model?: string): Promise<Session> {
    try {
      const requestData: CreateSessionRequest = {
        userId,
        title,
        model
      };
      
      const response = await api.post<SessionResponse>('/api/sessions', requestData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar sessão';
      throw new Error(errorMessage);
    }
  }

  // Obter sessões do usuário
  async getUserSessions(userId: string): Promise<Session[]> {
    try {
      const response = await api.get<SessionsResponse>(`/api/users/${userId}/sessions`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar sessões do usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar sessões';
      throw new Error(errorMessage);
    }
  }

  // Obter sessão específica
  async getSession(sessionId: string): Promise<Session> {
    try {
      const response = await api.get<SessionResponse>(`/api/sessions/${sessionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar sessão';
      throw new Error(errorMessage);
    }
  }

  // Deletar sessão
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await api.delete(`/api/sessions/${sessionId}`);
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar sessão';
      throw new Error(errorMessage);
    }
  }

  // Atualizar título da sessão
  async updateSessionTitle(sessionId: string, title: string): Promise<Session> {
    try {
      const requestData: UpdateSessionRequest = { title };
      const response = await api.put<SessionResponse>(`/api/sessions/${sessionId}`, requestData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar sessão';
      throw new Error(errorMessage);
    }
  }
}

// Instância singleton do serviço
export const sessionService = new SessionService();
