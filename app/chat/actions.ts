'use server';

import { GetAuthCurrentUserServer } from '@/utils/utils';
import { cookies } from 'next/headers';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { type Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';

// Definimos el tipo para la respuesta de la mutación
type AskCoachMutationResult = {
  data: string | null;
  errors: any[];
};

// Modificamos la Server Action para aceptar y devolver el sessionId
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
    if (sessionId.startsWith('new-')) { // Un prefijo que indica que es una nueva sesión
      currentSessionId = sessionId.substring(4); // Remueve el prefijo 'new-'
      isNewSession = true;

      await cookieBasedClient.models.Item.create({
        PK: `USER#${user.userId}`,
        SK: `CHAT_SESSION#${currentSessionId}`,
        userId: user.userId,
        type: 'CHAT_SESSION',
        timestamp: new Date().toISOString(),
        title: prompt.substring(0, Math.min(prompt.length, 50)) + (prompt.length > 50 ? '...' : ''), // Título basado en la primera pregunta
      });
    }

    // 1. Guardar el mensaje del usuario
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

    // 2. Llamar a la mutación GraphQL personalizada (que invoca la Lambda)
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

    // 3. Guardar la respuesta del asistente
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
      ...(isNewSession && { newSessionId: currentSessionId }) // Solo devuelve newSessionId si fue una nueva sesión
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