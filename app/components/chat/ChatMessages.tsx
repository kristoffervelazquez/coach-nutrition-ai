"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Fade,
  Skeleton,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useTranslation } from '@/app/hooks/useTranslation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatMessagesProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function ChatMessages({
  messages,
  onSendMessage,
  loading = false,
  disabled = false,
  placeholder = "Pregúntale algo a tu Coach AI...",
  onToggleSidebar,
  sidebarOpen = true
}: ChatMessagesProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const t = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || disabled) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50'
      }}
    >
      {/* Mobile Header */}
      {onToggleSidebar && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            flexShrink: 0
          }}
        >
          <IconButton 
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            {t('chat.title')}
          </Typography>
        </Box>
      )}
      
      {/* Messages Area */}
      <Box
        className="chat-messages-area"
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: { xs: 1, md: 2 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: { xs: '100%', sm: 400 },
              mx: 'auto',
              px: 2
            }}
          >
            <Avatar
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                bgcolor: 'primary.main',
                mb: 2
              }}
            >
              <BotIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
            </Avatar>
            
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
              {t('chat.greeting')}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {t('chat.greetingSubtext')}
            </Typography>
            
            <Box sx={{ textAlign: 'left', width: '100%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('chat.canAskAbout')}
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  {t('chat.mealPlans')}
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  {t('chat.workoutRoutines')}
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  {t('chat.goalStrategies')}
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  {t('chat.progressAnalysis')}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          messages.map((message, index) => (
            <Fade key={message.id} in={true} timeout={300}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: { xs: '90%', sm: '85%', md: '75%' }
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 28, md: 32 },
                      height: { xs: 28, md: 32 },
                      bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                      flexShrink: 0
                    }}
                  >
                    {message.role === 'user' ? (
                      <UserIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                    ) : (
                      <BotIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                    )}
                  </Avatar>
                  
                  <Paper
                    elevation={1}
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      bgcolor: message.role === 'user' 
                        ? 'primary.main' 
                        : 'background.paper',
                      color: message.role === 'user' 
                        ? 'primary.contrastText' 
                        : 'text.primary',
                      borderRadius: 2,
                      maxWidth: '100%',
                      minWidth: 0,
                      wordBreak: 'break-word'
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="chat-message-content"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.5,
                        fontSize: { xs: '0.85rem', md: '0.875rem' }
                      }}
                    >
                      {message.content}
                    </Typography>
                    
                    <Typography
                      variant="caption"
                      className="chat-message-time"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        mt: 1,
                        opacity: 0.7,
                        fontSize: { xs: '0.65rem', md: '0.7rem' }
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Fade>
          ))
        )}
        
        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, maxWidth: '80%' }}>
              <Avatar sx={{ 
                width: { xs: 28, md: 32 }, 
                height: { xs: 28, md: 32 }, 
                bgcolor: 'secondary.main',
                flexShrink: 0 
              }}>
                <BotIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
              </Avatar>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={40} />
                  <Skeleton variant="text" width={80} />
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        className="chat-input-container"
        sx={{
          p: { xs: 1, md: 2 },
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          flexShrink: 0
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            gap: 1,
            maxWidth: { xs: '100%', md: 800 },
            mx: 'auto'
          }}
        >
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || loading}
            size="medium"
            className="chat-input"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.paper',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={input.trim() ? t('common.send') : t('chat.placeholder')}>
                    <span>
                      <IconButton
                        type="submit"
                        disabled={!input.trim() || loading || disabled}
                        size="medium"
                        sx={{
                          bgcolor: input.trim() && !loading && !disabled ? 'primary.main' : 'grey.300',
                          color: input.trim() && !loading && !disabled ? 'white' : 'grey.500',
                          '&:hover': {
                            bgcolor: input.trim() && !loading && !disabled ? 'primary.dark' : 'grey.400'
                          },
                          borderRadius: 2,
                          width: { xs: 36, md: 40 },
                          height: { xs: 36, md: 40 }
                        }}
                      >
                        <SendIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
            fontSize: { xs: '0.7rem', md: '0.75rem' }
          }}
        >
          {t('chat.disclaimer')}
        </Typography>
      </Box>
    </Box>
  );
}