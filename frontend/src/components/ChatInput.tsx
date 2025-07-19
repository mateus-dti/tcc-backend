import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

const ChatInput: React.FC = () => {
  const { state, addMessage, setLoading } = useChat();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || state.isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, true);
    setLoading(true);

    // Simular resposta da AI (aqui você conectaria com o backend)
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = `Esta é uma resposta simulada para: "${userMessage}". Em uma implementação real, esta resposta viria do seu backend conectado à API do OpenRouter.`;
      
      addMessage(aiResponse, false);
    } catch {
      addMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <div className="chat-input__container">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="chat-input__textarea"
          rows={1}
          disabled={state.isLoading}
        />
        
        <button
          type="submit"
          disabled={!inputValue.trim() || state.isLoading}
          className="chat-input__send"
        >
          {state.isLoading ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13"/>
              <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          )}
        </button>
      </div>
      
      <div className="chat-input__footer">
        <span className="chat-input__hint">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </span>
      </div>
    </form>
  );
};

export default ChatInput;
