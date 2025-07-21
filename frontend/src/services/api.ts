import axios from 'axios';
import type { Session } from '../types';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação se disponível
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirecionar para login se necessário
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos para o Chat API
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Model {
  id: string;
  name: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    modelId: string;
    message: string;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };
  error?: string;
}

export interface ModelsResponse {
  success: boolean;
  data: Model[];
  count: number;
  error?: string;
}

// Serviços do Chat
export const chatService = {
  // Buscar modelos disponíveis
  async getModels(): Promise<Model[]> {
    try {
      const response = await api.get<ModelsResponse>('/api/chat/models');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar modelos:', error);
      throw new Error('Falha ao carregar modelos disponíveis');
    }
  },

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
  },

  // Enviar mensagem com contexto de conversa
  async sendConversationMessage(modelId: string, message: string, context?: string[]): Promise<{
    response: string;
    updatedContext: string[];
  }> {
    try {
      const response = await api.post('/api/chat/conversation', {
        modelId,
        message,
        context
      });
      
      if (response.data.success) {
        return {
          response: response.data.data.response,
          updatedContext: response.data.data.updatedContext
        };
      } else {
        throw new Error(response.data.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem com contexto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
      throw new Error(errorMessage);
    }
  }
};

// Tipos para Autenticação
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
  error?: string;
}

// Serviços de Autenticação
export const authService = {
  // Fazer login
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', credentials);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Salvar no localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { user, token };
      } else {
        throw new Error(response.data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  },

  // Fazer registro
  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', userData);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Salvar no localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { user, token };
      } else {
        throw new Error(response.data.error || 'Erro ao fazer registro');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer registro';
      throw new Error(errorMessage);
    }
  },

  // Verificar usuário atual
  async me(): Promise<User> {
    try {
      const response = await api.get('/api/auth/me');
      
      if (response.data.success) {
        return response.data.data.user;
      } else {
        throw new Error(response.data.error || 'Erro ao verificar usuário');
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      throw error;
    }
  },

  // Fazer logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Verificar se está logado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Obter usuário do localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Obter token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
};

// Serviços de sessão
export const sessionService = {
  // Criar nova sessão
  async createSession(userId: string): Promise<Session> {
    const response = await api.post('/api/sessions', { userId });
    return response.data.data;
  },

  // Obter sessões do usuário
  async getUserSessions(userId: string): Promise<Session[]> {
    const response = await api.get(`/api/sessions/user/${userId}`);
    return response.data.data;
  },

  // Obter sessão específica
  async getSession(sessionId: string): Promise<Session> {
    const response = await api.get(`/api/sessions/${sessionId}`);
    return response.data.data;
  },

  // Deletar sessão
  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/api/sessions/${sessionId}`);
  },

  // Atualizar título da sessão
  async updateSessionTitle(sessionId: string, title: string): Promise<Session> {
    const response = await api.put(`/api/sessions/${sessionId}`, { title });
    return response.data.data;
  }
};

export default api;
