import React from 'react';
import { useChat } from '../hooks/useChat';
import { ChatMessages, ChatInput } from './index';

const ChatWindow: React.FC = () => {
  const { state } = useChat();

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <h1 className="chat-window__title">ChatGPT Clone</h1>
        <p className="chat-window__subtitle">
          {state.messages.length > 0 
            ? `${state.messages.length} mensagens` 
            : 'Como posso ajudá-lo hoje?'
          }
        </p>
      </div>
      
      <div className="chat-window__content">
        <ChatMessages />
      </div>
      
      <div className="chat-window__input">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatWindow;
