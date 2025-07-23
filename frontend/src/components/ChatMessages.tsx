import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { ChatMessage } from './index';

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

// Componente de loading
const TypingIndicator: React.FC = () => {
  return (
    <div className="chat-message chat-message--ai">
      <div className="chat-message__avatar">
        <div className="chat-message__avatar-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8V4l8 8-8 8V16H4v-8z"/>
          </svg>
        </div>
      </div>
      <div className="chat-message__content">
        <div className="typing-indicator">
          <div className="typing-indicator__dot"></div>
          <div className="typing-indicator__dot"></div>
          <div className="typing-indicator__dot"></div>
        </div>
      </div>
    </div>
  );
};

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };

  // Scroll para baixo quando há novas mensagens
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll para cima quando está carregando (nova mensagem enviada)
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      setTimeout(() => scrollToTop(), 100);
    }
  }, [isLoading, messages.length]);

  if (messages.length === 0) {
    return (
      <div className="chat-messages chat-messages--empty">
        <div className="chat-welcome">
          <div className="chat-welcome__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6V4m6 2a6 6 0 11-12 0 6 6 0 0112 0zM12 16v4m-6-2a6 6 0 1112 0 6 6 0 01-12 0z"/>
            </svg>
          </div>
          <h2 className="chat-welcome__title">Como posso ajudá-lo hoje?</h2>
          <p className="chat-welcome__subtitle">
            Faça uma pergunta ou comece uma conversa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
