import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <div className="chat-layout">
      {children}
    </div>
  );
};

export default ChatLayout;
