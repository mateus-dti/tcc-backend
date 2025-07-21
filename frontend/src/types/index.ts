// Tipos relacionados ao usuário
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos relacionados à autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Tipos relacionados ao Chat e API
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

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatAPIResponse extends APIResponse {
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

export interface ModelsAPIResponse extends APIResponse {
  data: Model[];
  count: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Tipos relacionados ao chat
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

// Alias para compatibilidade
export type Session = ChatSession;

export interface SendMessageRequest {
  content: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  message: Message;
  sessionId: string;
}

// Tipos relacionados aos modelos
export interface Model {
  id: string;
  name: string;
  description?: string;
  provider: string;
  maxTokens?: number;
  pricing?: {
    input: number;
    output: number;
  };
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Tipos de componentes
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}
