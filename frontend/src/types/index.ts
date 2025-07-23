// Re-exportar todos os tipos dos módulos específicos
export type { ApiResponse, PaginationInfo, ChatUsage } from './api';
export type { 
  Model, 
  ChatMessage, 
  ChatMessageResponse, 
  ChatResponse, 
  ModelsResponse, 
  ConversationResponse,
  SessionChatResponse,
  SessionHistoryResponse,
  StartSessionResponse
} from './chat';
export type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  AuthData, 
  UserResponse 
} from './auth';
export type { 
  Session, 
  CreateSessionRequest, 
  UpdateSessionRequest, 
  SessionResponse, 
  SessionsResponse 
} from './session';

// Tipos relacionados ao chat (mantidos para compatibilidade)
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

// Tipos de componentes
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}
