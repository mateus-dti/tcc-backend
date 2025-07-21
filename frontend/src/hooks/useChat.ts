import { useContext } from 'react';
import { ChatContext } from '../context';

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

// Hook personalizado para facilitar o uso das funcionalidades do chat
export function useChatActions() {
  const { 
    state, 
    sendMessage, 
    setInput, 
    clearChat, 
    setSelectedModel, 
    loadModels 
  } = useChat();

  const handleSendMessage = async () => {
    if (state.currentInput.trim() && !state.isLoading) {
      const message = state.currentInput;
      setInput(''); // Limpar input imediatamente
      await sendMessage(message);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleModelChange = (modelId: string) => {
    const model = state.availableModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
    }
  };

  return {
    ...state,
    handleSendMessage,
    handleInputChange,
    handleModelChange,
    clearChat,
    loadModels,
  };
}
