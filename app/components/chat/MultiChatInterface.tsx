"use client";

import { useState, useEffect } from 'react';
import { Box, Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import { askCoach, getChatSessions, getChatMessages, deleteChatSession } from '@/app/chat/actions';
import { useTranslation } from '@/app/hooks/useTranslation';
import './chat.css';

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  lastMessage?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function MultiChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const t = useTranslation();


  useEffect(() => {
    loadSessions();
  }, []);

  // Cargar mensajes cuando cambia la sesión activa
  useEffect(() => {
    if (activeSessionId) {
      loadMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

    const loadSessions = async () => {
    try {
      setIsLoadingSessions(true);
      
      const loadedSessions = await getChatSessions();
      setSessions(loadedSessions);
      
      // Seleccionar la primera sesión automáticamente si no hay sesión actual
      if (loadedSessions.length > 0 && !activeSessionId) {
        setActiveSessionId(loadedSessions[0].id);
      } else if (loadedSessions.length === 0 && !activeSessionId) {
        // Si no hay sesiones, crear una nueva automáticamente
        handleNewChat();
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError(t('chat.errorLoadingSessions'));
      // En caso de error, crear una nueva sesión
      handleNewChat();
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      // No cargar mensajes para sesiones que empiecen con 'new-'
      if (sessionId.startsWith('new-')) {
        setMessages([]);
        return;
      }

      const messages = await getChatMessages(sessionId);
      setMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError(t('chat.errorLoading'));
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    const newSessionId = `new-${uuidv4()}`;
    setActiveSessionId(newSessionId);
    setMessages([]);
  };

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await askCoach(content, activeSessionId);
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Si es una nueva sesión, actualizar el ID y agregar a la lista
      if (response.newSessionId && activeSessionId.startsWith('new-')) {
        const newSession: ChatSession = {
          id: response.newSessionId,
          title: content.length > 50 ? content.substring(0, 50) + '...' : content,
          timestamp: new Date().toISOString(),
          lastMessage: response.response.substring(0, 100) + (response.response.length > 100 ? '...' : '')
        };
        
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(response.newSessionId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: t('chat.errors.generic'),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(t('chat.errorSending'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      // Eliminar en el backend
      await deleteChatSession(sessionId);
      // Actualizar estado local
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      setError('No se pudo eliminar la conversación');
    }
  };

  return (
    <Box 
      className="chat-container chat-main-container"
      sx={{ 
        display: 'flex',
        height: '100vh', 
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
        width: '100vw',
        margin: 0,
        padding: 0
      }}
    >      
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: sidebarOpen ? '100%' : 0, md: '280px' },
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          position: { xs: 'absolute', md: 'relative' },
          zIndex: { xs: 10, md: 'auto' },
          height: '100%'
        }}
      >
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionSelect={(sessionId) => {
            handleSessionSelect(sessionId);

            if (window.innerWidth < 900) {
              setSidebarOpen(false);
            }
          }}
          onNewChat={() => {
            handleNewChat();

            if (window.innerWidth < 900) {
              setSidebarOpen(false);
            }
          }}
          onDeleteSession={handleDeleteSession}
          loading={isLoadingSessions}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
      </Box>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <Box
          className="chat-sidebar-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 5,
            display: { xs: 'block', md: 'none' }
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0,
        height: '100%'
      }}>        
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
            sx={{ m: 1, flexShrink: 0 }}
          >
            {error}
          </Alert>
        )}
        
        <ChatMessages
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={isLoading}
          disabled={!activeSessionId}
          placeholder={!activeSessionId ? t('chat.placeholderNoSession') : t('chat.placeholder')}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
      </Box>
    </Box>
  );
}