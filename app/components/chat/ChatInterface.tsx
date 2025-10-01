"use client";

import { useState, useEffect } from 'react';
import { Box, TextField, List, ListItem, ListItemText, CircularProgress, Paper, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para generar IDs
import { askCoach } from '@/app/chat/actions';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null); // Estado para la ID de sesión

  useEffect(() => {
    // Genera un sessionId una vez al cargar el componente
    // Prefijo 'new-' para indicar a la Server Action que debe crear una CHAT_SESSION
    if (!sessionId) {
      setSessionId(`new-${uuidv4()}`);
    }
  }, [sessionId]); // Solo se ejecuta si sessionId es null inicialmente

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Pasa el sessionId a la Server Action
      const response = await askCoach(input, sessionId);
      const assistantResponse: Message = { role: 'assistant', content: response.response };
      setMessages((prev) => [...prev, assistantResponse]);

      // Si la Server Action indicó que fue una nueva sesión, actualiza el sessionId
      if (response.newSessionId) {
        setSessionId(response.newSessionId); // Quita el prefijo 'new-'
      }

    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: 'Lo siento, ocurrió un error al comunicarse con el coach. Por favor, intenta de nuevo.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <ListItem key={index} sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.300',
                color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                maxWidth: '70%',
              }}
            >
              <ListItemText primary={<Typography sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>} />
            </Paper>
          </ListItem>
        ))}
        {isLoading && <ListItem sx={{ justifyContent: 'flex-start' }}><CircularProgress size={24} /></ListItem>}
      </List>
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: '1px solid #ddd' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pregúntale algo a tu coach..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || !sessionId}
          autoFocus
        />
      </Box>
    </Box>
  );
}