'use server';

import { GetAuthCurrentUserServer } from '@/utils/utils';
import { cookies } from 'next/headers';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { type Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';


type AskCoachMutationResult = {
  data: string | null;
  errors: any[];
};


export async function askCoach(prompt: string, sessionId: string): Promise<{ response: string, newSessionId?: string }> {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    throw new Error('Usuario no autenticado.');
  }

  if (!prompt || prompt.trim().length === 0) {
    return { response: 'Por favor, introduce una pregunta.' };
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  let currentSessionId = sessionId;
  let isNewSession = false;

  try {
    // Si el sessionId es nuevo (lo generó el cliente en el primer mensaje)
    // guarda un registro de la sesión en DynamoDB
    if (sessionId.startsWith('new-')) {
      currentSessionId = sessionId.substring(4); 
      isNewSession = true;

      await cookieBasedClient.models.Item.create({
        PK: `USER#${user.userId}`,
        SK: `CHAT_SESSION#${currentSessionId}`,
        userId: user.userId,
        type: 'CHAT_SESSION',
        timestamp: new Date().toISOString(),
        title: prompt.substring(0, Math.min(prompt.length, 50)) + (prompt.length > 50 ? '...' : ''),
      });
    }

    
    await cookieBasedClient.models.Item.create({
      PK: `USER#${user.userId}`,
      SK: `CHAT_MESSAGE#${currentSessionId}#${Date.now()}-user`,
      userId: user.userId,
      type: 'CHAT_MESSAGE',
      timestamp: new Date().toISOString(),
      sessionId: currentSessionId,
      messageRole: 'user',
      messageContent: prompt,
    });
    
    console.log('Llamando a la mutación askCoach con prompt:', prompt, 'y sessionId:', currentSessionId);

    // Llamar mutacion lambda
    const result = await cookieBasedClient.mutations.askCoach({
      prompt: prompt,
      sessionId: currentSessionId, // Pasa el sessionId a la Lambda
    }) as AskCoachMutationResult;

    if (result.errors) {
      console.error('Errores en la mutación de GraphQL:', result.errors);
      throw new Error(result.errors.map(err => err.message).join('; '));
    }
    console.log('Resultado de la mutación askCoach:', result);
    const assistantResponse = result.data ?? 'No se recibió una respuesta del coach.';

    // Guardar la respuesta del asistente
    await cookieBasedClient.models.Item.create({
      PK: `USER#${user.userId}`,
      SK: `CHAT_MESSAGE#${currentSessionId}#${Date.now()}-assistant`,
      userId: user.userId,
      type: 'CHAT_MESSAGE',
      timestamp: new Date().toISOString(),
      sessionId: currentSessionId,
      messageRole: 'assistant',
      messageContent: assistantResponse,
    });

    return { 
      response: assistantResponse,
      ...(isNewSession && { newSessionId: currentSessionId }) 
    };

  } catch (error) {
    // Manejo de la excepción de redirección de Next.js
    if (error && typeof error === 'object' && 'message' in error && error.message === 'NEXT_REDIRECT') {
        throw error;
    }
    console.error('Error al llamar a la acción askCoach:', error);
    throw new Error('Ocurrió un error al comunicarse con el coach de IA.');
  }
}

// Función para obtener las sesiones de chat del usuario
export async function getChatSessions() {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    throw new Error('Usuario no autenticado.');
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  try {
    const { data } = await cookieBasedClient.models.Item.list({
      filter: {
        PK: { eq: `USER#${user.userId}` },
        SK: { beginsWith: 'CHAT_SESSION#' }
      }
    });

    return data.map(session => ({
      id: session.SK?.replace('CHAT_SESSION#', '') || '',
      title: session.title || 'Conversación sin título',
      timestamp: session.timestamp || session.createdAt?.toString() || '',
    })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  } catch (error) {
    console.error('Error obteniendo sesiones de chat:', error);
    throw new Error('No se pudieron cargar las conversaciones');
  }
}


export async function getChatMessages(sessionId: string) {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    throw new Error('Usuario no autenticado.');
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  try {
    const { data } = await cookieBasedClient.models.Item.list({
      filter: {
        PK: { eq: `USER#${user.userId}` },
        SK: { beginsWith: `CHAT_MESSAGE#${sessionId}#` }
      }
    });

    return data.map(message => ({
      id: message.SK || '',
      role: message.messageRole as 'user' | 'assistant',
      content: message.messageContent || '',
      timestamp: message.timestamp || message.createdAt?.toString() || ''
    })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  } catch (error) {
    console.error('Error obteniendo mensajes del chat:', error);
    throw new Error('No se pudieron cargar los mensajes');
  }
}

// Función para eliminar una sesión de chat
export async function deleteChatSession(sessionId: string) {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    throw new Error('Usuario no autenticado.');
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  try {
    // Eliminar todos los mensajes de la sesión
    const { data: messages } = await cookieBasedClient.models.Item.list({
      filter: {
        PK: { eq: `USER#${user.userId}` },
        SK: { beginsWith: `CHAT_MESSAGE#${sessionId}#` }
      }
    });

    // Eliminar cada mensaje
    for (const message of messages) {
      if (message.PK && message.SK) {
        await cookieBasedClient.models.Item.delete({ 
          PK: message.PK, 
          SK: message.SK 
        });
      }
    }

    // Eliminar la sesión
    const { data: sessions } = await cookieBasedClient.models.Item.list({
      filter: {
        PK: { eq: `USER#${user.userId}` },
        SK: { eq: `CHAT_SESSION#${sessionId}` }
      }
    });

    if (sessions[0]?.PK && sessions[0]?.SK) {
      await cookieBasedClient.models.Item.delete({ 
        PK: sessions[0].PK, 
        SK: sessions[0].SK 
      });
    }

    return true;
  } catch (error) {
    console.error('Error eliminando sesión de chat:', error);
    throw new Error('No se pudo eliminar la conversación');
  }
}