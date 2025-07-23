import React from 'react';
import type { Session, Message } from '../types';
import { ChatMessages, ChatInput } from './index';

interface ChatWindowProps {
  currentSession: Session | null;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentSession,
  messages,
  isLoading,
  onSendMessage,
}) => {
  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <h1 className="chat-window__title">
          {currentSession?.title || 'Nova Conversa'}
        </h1>
        <p className="chat-window__subtitle">
          {messages.length > 0 
            ? `${messages.length} mensagens` 
            : 'Como posso ajudá-lo hoje?'
          }
        </p>
      </div>
      
      <div className="chat-window__content">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>
      
      <div className="chat-window__input">
        <ChatInput 
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
