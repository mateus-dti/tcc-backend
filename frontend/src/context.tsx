import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { chatService, type Model } from './services/api';

// Types
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentInput: string;
  selectedModel: Model;
  availableModels: Model[];
  error: string | null;
  conversationContext: string[];
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_SELECTED_MODEL'; payload: Model }
  | { type: 'SET_AVAILABLE_MODELS'; payload: Model[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONVERSATION_CONTEXT'; payload: string[] }
  | { type: 'CLEAR_CHAT' };

// Initial state
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  currentInput: '',
  selectedModel: {
    id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    name: 'Venice: Uncensored'
  },
  availableModels: [],
  error: null,
  conversationContext: []
};

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_INPUT':
      return {
        ...state,
        currentInput: action.payload,
      };
    case 'SET_SELECTED_MODEL':
      return {
        ...state,
        selectedModel: action.payload,
      };
    case 'SET_AVAILABLE_MODELS':
      return {
        ...state,
        availableModels: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_CONVERSATION_CONTEXT':
      return {
        ...state,
        conversationContext: action.payload,
      };
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
        conversationContext: [],
        error: null,
      };
    default:
      return state;
  }
}

// Context
interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  addMessage: (text: string, isUser: boolean) => void;
  setLoading: (loading: boolean) => void;
  setInput: (input: string) => void;
  setSelectedModel: (model: Model) => void;
  setAvailableModels: (models: Model[]) => void;
  setError: (error: string | null) => void;
  setConversationContext: (context: string[]) => void;
  clearChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  loadModels: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Export the context
export { ChatContext };

// Provider
interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const addMessage = (text: string, isUser: boolean) => {
    const message: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      isUser,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setInput = (input: string) => {
    dispatch({ type: 'SET_INPUT', payload: input });
  };

  const setSelectedModel = (model: Model) => {
    dispatch({ type: 'SET_SELECTED_MODEL', payload: model });
  };

  const setAvailableModels = (models: Model[]) => {
    dispatch({ type: 'SET_AVAILABLE_MODELS', payload: models });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setConversationContext = (context: string[]) => {
    dispatch({ type: 'SET_CONVERSATION_CONTEXT', payload: context });
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  // Função para carregar modelos do backend
  const loadModels = useCallback(async () => {
    try {
      setError(null);
      const models = await chatService.getModels();
      setAvailableModels(models);
      
      // Se não há modelo selecionado ou o modelo atual não está na lista, selecionar o primeiro
      if (models.length > 0 && (!state.selectedModel || !models.find(m => m.id === state.selectedModel.id))) {
        setSelectedModel(models[0]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar modelos';
      setError(errorMessage);
      console.error('Erro ao carregar modelos:', error);
    }
  }, [state.selectedModel]);

  // Função para enviar mensagem
  const sendMessage = async (message: string) => {
    if (!message.trim() || state.isLoading) return;

    try {
      setError(null);
      setLoading(true);
      
      // Adicionar mensagem do usuário
      addMessage(message, true);
      
      // Enviar para o backend usando contexto de conversa
      const result = await chatService.sendConversationMessage(
        state.selectedModel.id,
        message,
        state.conversationContext
      );
      
      // Adicionar resposta do assistente
      addMessage(result.response, false);
      
      // Atualizar contexto da conversa
      setConversationContext(result.updatedContext);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
      setError(errorMessage);
      addMessage(`Erro: ${errorMessage}`, false);
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar modelos ao montar o componente
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return (
    <ChatContext.Provider value={{
      state,
      dispatch,
      addMessage,
      setLoading,
      setInput,
      setSelectedModel,
      setAvailableModels,
      setError,
      setConversationContext,
      clearChat,
      sendMessage,
      loadModels,
    }}>
      {children}
    </ChatContext.Provider>
  );
}
