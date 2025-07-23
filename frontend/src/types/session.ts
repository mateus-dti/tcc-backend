import type { ApiResponse } from './api';

// Tipos relacionados às sessões
export interface Session {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages?: import('./index').Message[];
  model?: string;
}

export interface CreateSessionRequest {
  userId: string;
  title?: string;
  model?: string;
}

export interface UpdateSessionRequest {
  title: string;
}

// Tipos para respostas de sessão
export interface SessionResponse extends ApiResponse {
  data: Session;
}

export interface SessionsResponse extends ApiResponse {
  data: Session[];
}
