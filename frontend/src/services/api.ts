// Este arquivo mantém compatibilidade com código existente
// Re-exporta todos os serviços e tipos da nova estrutura

export { api } from './api/config';
export { authService } from './api/authService';
export { chatService } from './api/chatService'; 
export { sessionService } from './api/sessionService';

// Re-exportar tipos para compatibilidade
export type * from '../types/auth';
export type * from '../types/chat';
export type * from '../types/session';
export type * from '../types/api';

// Para backward compatibility - criar instâncias dos serviços
import { authService } from './api/authService';
import { chatService } from './api/chatService';
import { sessionService } from './api/sessionService';

// Manter exports antigos para compatibilidade (deprecated)
export const { login, register, me, logout, isAuthenticated, getCurrentUser, getToken } = authService;
export const { getModels, sendMessage, sendConversationMessage, startChatSession, sendSessionMessage, getSessionHistory } = chatService;
export const { createSession, getUserSessions, getSession, deleteSession, updateSessionTitle } = sessionService;
