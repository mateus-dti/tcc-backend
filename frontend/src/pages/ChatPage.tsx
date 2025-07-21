import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChatLayout, ChatWindow, ChatSidebar } from '../components';
import type { Session, Message } from '../types';
import { sessionService } from '../services/api';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { state: authState } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, navigate]);

  // Carregar sessões do usuário
  useEffect(() => {
    const loadSessions = async () => {
      if (!authState.user) return;

      try {
        setIsLoadingSessions(true);
        const userSessions = await sessionService.getUserSessions(authState.user.id);
        setSessions(userSessions);
      } catch (error) {
        console.error('Erro ao carregar sessões:', error);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    if (authState.isAuthenticated) {
      loadSessions();
    }
  }, [authState.isAuthenticated, authState.user]);

  const handleCreateNewSession = useCallback(async () => {
    if (!authState.user) return;

    try {
      const newSession = await sessionService.createSession(authState.user.id);
      setSessions(prev => [newSession, ...prev]);
      navigate(`/chat/${newSession.id}`, { replace: true });
    } catch (error) {
      console.error('Erro ao criar nova sessão:', error);
    }
  }, [authState.user, navigate]);

  // Gerenciar sessão ativa baseada na URL
  useEffect(() => {
    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
        setMessages(session.messages || []);
      } else {
        // Sessão não encontrada, redirecionar para uma nova sessão
        handleCreateNewSession();
      }
    } else if (!sessionId && sessions.length > 0) {
      // Se não há sessionId na URL, usar a primeira sessão disponível
      const firstSession = sessions[0];
      navigate(`/chat/${firstSession.id}`, { replace: true });
    } else if (!sessionId && sessions.length === 0 && !isLoadingSessions) {
      // Se não há sessões, criar uma nova
      handleCreateNewSession();
    }
  }, [sessionId, sessions, isLoadingSessions, handleCreateNewSession, navigate]);

  const handleSelectSession = (session: Session) => {
    navigate(`/chat/${session.id}`);
  };

  const handleDeleteSession = async (sessionToDelete: Session) => {
    try {
      await sessionService.deleteSession(sessionToDelete.id);
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      
      // Se a sessão deletada era a atual, navegar para outra sessão
      if (sessionToDelete.id === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionToDelete.id);
        if (remainingSessions.length > 0) {
          navigate(`/chat/${remainingSessions[0].id}`, { replace: true });
        } else {
          handleCreateNewSession();
        }
      }
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!sessionId || !authState.user) return;

    try {
      setIsLoading(true);
      
      // Adicionar mensagem do usuário imediatamente
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content: message,
        role: 'user',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Aqui você integraria com a API de chat
      // Por enquanto, vou simular uma resposta
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          content: 'Esta é uma resposta simulada. A integração com a API real será implementada em seguida.',
          role: 'assistant',
          timestamp: new Date().toISOString(),
          sessionId: sessionId,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setIsLoading(false);
    }
  };

  if (!authState.isAuthenticated) {
    return null; // O useEffect já vai redirecionar
  }

  return (
    <ChatLayout>
      <ChatSidebar
        sessions={sessions}
        currentSessionId={sessionId || null}
        onSelectSession={handleSelectSession}
        onCreateNewSession={handleCreateNewSession}
        onDeleteSession={handleDeleteSession}
        isLoading={isLoadingSessions}
      />
      <ChatWindow
        currentSession={currentSession}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </ChatLayout>
  );
};

export default ChatPage;
