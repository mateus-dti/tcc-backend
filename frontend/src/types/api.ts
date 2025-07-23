// Tipos base para resposta da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para paginação
export interface PaginationInfo {
  limit: number;
  offset: number;
  count: number;
}

// Tipos para resposta de uso (usage)
export interface ChatUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}
