import React from 'react';

const ChatSidebar: React.FC = () => {
  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar__header">
        <button className="chat-sidebar__new-chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nova conversa
        </button>
      </div>
      
      <div className="chat-sidebar__conversations">
        <div className="chat-sidebar__conversation chat-sidebar__conversation--active">
          <span className="chat-sidebar__conversation-title">Conversa atual</span>
        </div>
      </div>
      
      <div className="chat-sidebar__footer">
        <div className="chat-sidebar__user">
          <div className="chat-sidebar__user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span className="chat-sidebar__user-name">Usuário</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
