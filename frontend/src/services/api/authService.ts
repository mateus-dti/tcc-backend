import { api } from './config';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  AuthData 
} from '../../types/auth';

export class AuthService {
  // Fazer login
  async login(credentials: LoginRequest): Promise<AuthData> {
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
  }

  // Fazer registro
  async register(userData: RegisterRequest): Promise<AuthData> {
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
  }

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
  }

  // Fazer logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Verificar se está logado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

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
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

// Instância singleton do serviço
export const authService = new AuthService();
