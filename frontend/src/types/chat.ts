import type { ApiResponse } from './api';

// Tipos relacionados aos modelos
export interface Model {
  id: string;
  name: string;
  description?: string;
  provider?: string;
  maxTokens?: number;
  pricing?: {
    input: number;
    output: number;
  };
}

// Tipos para mensagens de chat
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Tipos para mensagem de resposta da API
export interface ChatMessageResponse {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sessionId: string;
  model?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

// Tipos para respostas da API de chat
export interface ChatResponse extends ApiResponse {
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
}

export interface ModelsResponse extends ApiResponse {
  data: Model[];
  count: number;
}

export interface ConversationResponse extends ApiResponse {
  data: {
    response: string;
    updatedContext: string[];
  };
}

// Tipos para respostas de sessão
export interface SessionChatResponse extends ApiResponse {
  data: {
    sessionId: string;
    message: ChatMessageResponse;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
    model: string;
  };
}

export interface SessionHistoryResponse extends ApiResponse {
  data: {
    session: import('./index').Session;
    messages: ChatMessageResponse[];
    pagination: {
      limit: number;
      offset: number;
      count: number;
    };
  };
}

export interface StartSessionResponse extends ApiResponse {
  data: {
    session: import('./index').Session;
    firstMessage?: ChatMessageResponse;
  };
}
