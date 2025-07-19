import React, { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from './index';

const ChatMessages: React.FC = () => {
  const { state } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  if (state.messages.length === 0) {
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
    <div className="chat-messages">
      {state.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {state.isLoading && (
        <div className="chat-message chat-message--ai">
          <div className="chat-message__avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v6m0 6v6"/>
            </svg>
          </div>
          <div className="chat-message__content">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
