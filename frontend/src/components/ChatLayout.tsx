import React from 'react';
import { ChatSidebar, ChatWindow } from './index';

const ChatLayout: React.FC = () => {
  return (
    <div className="chat-layout">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatLayout;
