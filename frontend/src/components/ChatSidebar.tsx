import React from 'react';
import type { Session } from '../types';
import { useAuth } from '../hooks/useAuth';

interface ChatSidebarProps {
  sessions: Session[];
  currentSessionId: string | null;
  onSelectSession: (session: Session) => void;
  onCreateNewSession: () => void;
  onDeleteSession: (session: Session) => void;
  isLoading: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
  isLoading,
}) => {
  const { state: authState, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const formatSessionTitle = (session: Session) => {
    if (session.title && session.title.trim()) {
      return session.title;
    }
    
    // Se não há título, usar as primeiras palavras da primeira mensagem
    if (session.messages && session.messages.length > 0) {
      const firstUserMessage = session.messages.find(msg => msg.role === 'user');
      if (firstUserMessage) {
        return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
      }
    }
    
    return 'Nova conversa';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Hoje';
    } else if (diffDays === 2) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="chat-sidebar">
      {/* Header com botão de nova conversa */}
      <div className="chat-sidebar__header">
        <button 
          className="chat-sidebar__new-chat"
          onClick={onCreateNewSession}
          disabled={isLoading}
          title="Criar nova conversa"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nova conversa
        </button>
      </div>
      
      {/* Lista de conversas */}
      <div className="chat-sidebar__conversations">
        {isLoading ? (
          <div className="chat-sidebar__loading">
            <div className="chat-sidebar__loading-spinner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            </div>
            <span>Carregando conversas...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="chat-sidebar__empty">
            <div className="chat-sidebar__empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </div>
            <p>Nenhuma conversa ainda</p>
            <small>Clique em "Nova conversa" para começar</small>
          </div>
        ) : (
          <>
            {sessions.map((session) => (
              <div 
                key={session.id}
                className={`chat-sidebar__conversation ${
                  session.id === currentSessionId ? 'chat-sidebar__conversation--active' : ''
                }`}
                onClick={() => onSelectSession(session)}
                title={formatSessionTitle(session)}
              >
                <div className="chat-sidebar__conversation-content">
                  <div className="chat-sidebar__conversation-title">
                    {formatSessionTitle(session)}
                  </div>
                  <div className="chat-sidebar__conversation-date">
                    {formatDate(session.updatedAt || session.createdAt)}
                  </div>
                  <div className="chat-sidebar__conversation-preview">
                    {session.messages && session.messages.length > 0 
                      ? `${session.messages.length} mensagem${session.messages.length > 1 ? 's' : ''}`
                      : 'Conversa vazia'
                    }
                  </div>
                </div>
                
                <button
                  className="chat-sidebar__conversation-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Tem certeza que deseja deletar esta conversa?')) {
                      onDeleteSession(session);
                    }
                  }}
                  title="Deletar conversa"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Footer com informações do usuário */}
      <div className="chat-sidebar__footer">
        <div className="chat-sidebar__user">
          <div className="chat-sidebar__user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="chat-sidebar__user-info">
            <span className="chat-sidebar__user-name">
              {authState.user?.name || 'Usuário'}
            </span>
            <span className="chat-sidebar__user-email">
              {authState.user?.email}
            </span>
          </div>
          <button 
            className="chat-sidebar__logout"
            onClick={handleLogout}
            title="Sair da conta"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
