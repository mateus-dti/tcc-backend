import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { ChatLayout, ChatWindow, ChatSidebar } from '../components';
import { ChatProvider } from '../context';
import type { Session, Message } from '../types';
import { sessionService, chatService } from '../services/api';

const ChatPage: React.FC = () => {
  return (
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
};

const ChatPageContent: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { state: authState } = useAuth();
  const { state: chatState } = useChat();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Obter modelo selecionado do contexto de chat
  const selectedModel = chatState.selectedModel;

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
      // Usar o chatService para iniciar uma nova sessão
      const result = await chatService.startChatSession(
        'Nova Conversa',
        selectedModel.id
      );
      
      const newSession = result.session;
      setSessions(prev => [newSession, ...prev]);
      navigate(`/chat/${newSession.id}`, { replace: true });
    } catch (error) {
      console.error('Erro ao criar nova sessão:', error);
      // Fallback para o método anterior se falhar
      try {
        const newSession = await sessionService.createSession(authState.user.id);
        setSessions(prev => [newSession, ...prev]);
        navigate(`/chat/${newSession.id}`, { replace: true });
      } catch (fallbackError) {
        console.error('Erro no fallback ao criar nova sessão:', fallbackError);
      }
    }
  }, [authState.user, navigate, selectedModel.id]);

  // Gerenciar sessão ativa baseada na URL
  useEffect(() => {
    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
        // Carregar histórico da sessão
        loadSessionHistory(sessionId);
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

  // Função para carregar histórico da sessão
  const loadSessionHistory = async (sessionId: string) => {
    try {
      const history = await chatService.getSessionHistory(sessionId, 50);
      setMessages(history.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.timestamp,
        sessionId: msg.sessionId,
      })));
    } catch (error) {
      console.error('Erro ao carregar histórico da sessão:', error);
    }
  };

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
      
      // Enviar mensagem para o backend usando a rota de sessão
      const result = await chatService.sendSessionMessage(
        sessionId,
        message,
        selectedModel.id // Usar o modelo selecionado
      );
      
      // Remover mensagem temporária e adicionar mensagens reais
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== userMessage.id);
        
        // Adicionar mensagem do usuário real
        const realUserMessage: Message = {
          id: `user-${Date.now()}`,
          content: message,
          role: 'user',
          timestamp: new Date().toISOString(),
          sessionId: sessionId,
        };
        
        // Adicionar resposta do assistente
        const assistantMessage: Message = {
          id: result.message.id,
          content: result.message.content,
          role: 'assistant',
          timestamp: result.message.timestamp,
          sessionId: sessionId,
        };
        
        return [...filteredMessages, realUserMessage, assistantMessage];
      });
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Remover mensagem temporária em caso de erro
      setMessages(prev => {
        const remainingMessages = prev.filter(msg => !msg.id.startsWith('temp-'));
        
        // Adicionar mensagem de erro
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
          role: 'assistant',
          timestamp: new Date().toISOString(),
          sessionId: sessionId!,
        };
        
        return [...remainingMessages, errorMessage];
      });
    } finally {
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
