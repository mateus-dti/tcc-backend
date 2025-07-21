import React, { createContext, useReducer, useEffect } from 'react';
import { authService, type User, type LoginRequest, type RegisterRequest } from '../services/api';

// Types
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Context
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the context
export { AuthContext };

// Provider
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Função para fazer login
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const result = await authService.login(credentials);
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user: result.user, token: result.token } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Função para fazer registro
  const register = async (userData: RegisterRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const result = await authService.register(userData);
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user: result.user, token: result.token } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer registro';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Função para fazer logout
  const logout = () => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Função para limpar erro
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Função para verificar autenticação ao carregar
  const checkAuth = async () => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (user && token) {
        try {
          // Verificar se o token ainda é válido
          await authService.me();
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user, token } 
          });
        } catch {
          // Token inválido, fazer logout
          authService.logout();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      }
    }
  };

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      state,
      login,
      register,
      logout,
      clearError,
      checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
