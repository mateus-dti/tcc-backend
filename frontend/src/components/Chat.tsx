import React from 'react';
import { ChatProvider } from '../context';
import { ChatLayout } from './index';

const Chat: React.FC = () => {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
};

export default Chat;
