"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Button,
  Paper,
  Divider,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Today as TodayIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  lastMessage?: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession?: (sessionId: string) => void;
  loading?: boolean;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  loading = false,
  onToggleSidebar,
  sidebarOpen = true
}: ChatSidebarProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSessionForMenu, setSelectedSessionForMenu] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, sessionId: string) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedSessionForMenu(sessionId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSessionForMenu(null);
  };

  const handleDeleteSession = () => {
    if (selectedSessionForMenu && onDeleteSession) {
      onDeleteSession(selectedSessionForMenu);
    }
    handleMenuClose();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
  };

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const groups: { [key: string]: ChatSession[] } = {
      'Hoy': [],
      'Ayer': [],
      'Hace 7 días': [],
      'Hace 30 días': [],
      'Anteriores': []
    };

    sessions.forEach(session => {
      const date = new Date(session.timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      const diffInDays = diffInHours / 24;

      if (diffInHours < 24) {
        groups['Hoy'].push(session);
      } else if (diffInDays < 2) {
        groups['Ayer'].push(session);
      } else if (diffInDays < 7) {
        groups['Hace 7 días'].push(session);
      } else if (diffInDays < 30) {
        groups['Hace 30 días'].push(session);
      } else {
        groups['Anteriores'].push(session);
      }
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate(sessions);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: { xs: 0, md: 1 },
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column'
      }}
    >

      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>

        {onToggleSidebar && (
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', mb: 1 }}>
            <IconButton onClick={onToggleSidebar} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{
            justifyContent: 'flex-start',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.9rem'
          }}
        >
          Nueva conversación
        </Button>
      </Box>

      {/* Chat List */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
        {loading ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Cargando conversaciones...
            </Typography>
          </Box>
        ) : sessions.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No hay conversaciones aún
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Inicia una nueva conversación con tu Coach AI
            </Typography>
          </Box>
        ) : (
          Object.entries(sessionGroups).map(([groupName, groupSessions]) => {
            if (groupSessions.length === 0) return null;
            
            return (
              <Box key={groupName} sx={{ mb: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ 
                    px: 2, 
                    py: 1, 
                    display: 'block',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                  }}
                >
                  {groupName}
                </Typography>
                
                <List dense sx={{ px: 1 }}>
                  {groupSessions.map((session) => (
                    <ListItem key={session.id} disablePadding>
                      <Paper
                        elevation={0}
                        sx={{
                          width: '100%',
                          bgcolor: activeSessionId === session.id ? 'primary.50' : 'transparent',
                          border: 1,
                          borderColor: activeSessionId === session.id ? 'primary.200' : 'transparent',
                          borderRadius: 2,
                          mb: 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: activeSessionId === session.id ? 'primary.50' : 'grey.50',
                            borderColor: 'grey.200'
                          }
                        }}
                      >
                        <ListItemButton
                          onClick={() => onSessionSelect(session.id)}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            px: 2
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              fontWeight={activeSessionId === session.id ? 600 : 400}
                              noWrap
                              sx={{ mb: 0.5 }}
                            >
                              {session.title}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <TimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(session.timestamp)}
                              </Typography>
                            </Box>
                            
                            {session.lastMessage && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{ 
                                  display: 'block',
                                  mt: 0.5,
                                  opacity: 0.8
                                }}
                              >
                                {session.lastMessage}
                              </Typography>
                            )}
                          </Box>
                          
                          {onDeleteSession && (
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, session.id)}
                              sx={{ 
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '.MuiListItemButton-root:hover &': {
                                  opacity: 1
                                }
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          )}
                        </ListItemButton>
                      </Paper>
                    </ListItem>
                  ))}
                </List>
              </Box>
            );
          })
        )}
      </Box>

      {/* Menu for session actions */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleDeleteSession} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Eliminar conversación
        </MenuItem>
      </Menu>
    </Box>
  );
}