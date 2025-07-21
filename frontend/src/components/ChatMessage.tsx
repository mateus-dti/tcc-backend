import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--ai'}`}>
      <div className="chat-message__avatar">
        {isUser ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v6m0 6v6"/>
          </svg>
        )}
      </div>
      
      <div className="chat-message__content">
        <div className="chat-message__header">
          <span className="chat-message__author">
            {isUser ? 'Você' : 'Assistente'}
          </span>
          <span className="chat-message__time">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div className="chat-message__text">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
