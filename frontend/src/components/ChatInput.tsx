import React, { useRef, useEffect, useState } from 'react';
import ModelSelector from './ModelSelector';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [currentInput, setCurrentInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isLoading) {
      const message = currentInput;
      setCurrentInput('');
      await onSendMessage(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const handleInputChange = (value: string) => {
    setCurrentInput(value);
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
  }, [currentInput]);

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <div className="chat-input__container">
        <textarea
          ref={textareaRef}
          value={currentInput}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="chat-input__textarea"
          rows={1}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!currentInput.trim() || isLoading}
          className="chat-input__send"
        >
          {isLoading ? (
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
        <ModelSelector />
        <span className="chat-input__hint">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </span>
      </div>
    </form>
  );
};

export default ChatInput;
