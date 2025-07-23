import type { ApiResponse } from './api';

// Tipos relacionados ao usuário
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para requisições de autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Tipos para respostas de autenticação
export interface AuthResponse extends ApiResponse {
  data: {
    user: User;
    token: string;
  };
}

export interface AuthData {
  user: User;
  token: string;
}

export interface UserResponse extends ApiResponse {
  data: {
    user: User;
  };
}
