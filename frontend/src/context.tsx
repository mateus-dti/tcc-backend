import React, { createContext, useReducer } from 'react';
import type { ReactNode } from 'react';

// Types
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Model {
  id: string;
  name: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentInput: string;
  selectedModel: Model;
  availableModels: Model[];
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_SELECTED_MODEL'; payload: Model }
  | { type: 'SET_AVAILABLE_MODELS'; payload: Model[] }
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
  availableModels: [
    {
      id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
      name: 'Venice: Uncensored'
    },
    {
      id: 'google/gemma-3n-e2b-it:free',
      name: 'Gemma 3N 2B'
    },
    {
      id: 'tngtech/deepseek-r1t2-chimera:free',
      name: 'DeepSeek R1T2 Chimera'
    },
    {
      id: 'openrouter/cypher-alpha:free',
      name: 'Cypher Alpha'
    },
    {
      id: 'mistralai/mistral-small-3.2-24b-instruct:free',
      name: 'Mistral Small 3.2 24B Instruct'
    },
    {
      id: 'moonshotai/kimi-dev-72b:free',
      name: 'Kimi Dev 72B'
    }
  ],
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
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
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
  clearChat: () => void;
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

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  return (
    <ChatContext.Provider value={{
      state,
      dispatch,
      addMessage,
      setLoading,
      setInput,
      setSelectedModel,
      setAvailableModels,
      clearChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
}
