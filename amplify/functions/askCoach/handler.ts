// amplify/functions/askCoach/handler.ts
import type { AppSyncResolverEvent } from 'aws-lambda';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

type Arguments = {
  prompt: string;
  sessionId?: string; // Ahora la Lambda recibe el sessionId
};

// Inicialización de clientes
const openai = new OpenAI();
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event: AppSyncResolverEvent<Arguments>): Promise<string> => {
  const { prompt, sessionId } = event.arguments;
  // Extraer el userId según el tipo de identidad
  let userId: string | undefined;
  const identity = event.identity;

  if (identity) {
    if ('sub' in identity && typeof identity.sub === 'string') {
      userId = identity.sub;
    } else if ('username' in identity && typeof identity.username === 'string') {
      userId = identity.username;
    } else if ('issuer' in identity && typeof identity.issuer === 'string') {
      userId = identity.issuer;
    }
  }

  if (!userId) {
    throw new Error('Usuario no autenticado.');
  }

  try {
    // 1. Crear embedding del prompt del usuario
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: prompt,
      dimensions: 512,
    });
    const promptEmbedding = embeddingResponse.data[0].embedding;

    // 2. Consultar Pinecone para obtener logs relevantes
    const queryResponse = await pineconeIndex.namespace(userId).query({
      topK: 5,
      vector: promptEmbedding,
      includeMetadata: true,
    });
    const contextFromLogs = queryResponse.matches
      .map(match => match.metadata?.originalNotes)
      .filter(Boolean)
      .join('\n- ');

    // 3. Obtener el perfil del usuario de DynamoDB
    const profileCommand = new QueryCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      KeyConditionExpression: "PK = :pk and SK = :sk",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":sk": "PROFILE",
      },
      Limit: 1,
    });
    const { Items: profileItems } = await docClient.send(profileCommand);
    const userProfile = profileItems?.[0];

    const profileContext = userProfile
      ? `Objetivos: ${userProfile.fitnessGoals}, Peso: ${userProfile.weight}kg, Edad: ${userProfile.age} años. Otros: ${userProfile.otherInfo || ''}`
      : "No se encontró el perfil del usuario.";

    // 4. Obtener el historial de la conversación actual (si sessionId existe)
    let chatHistoryContext = "";
    if (sessionId) {
      const chatHistoryCommand = new QueryCommand({
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": `USER#${userId}`,
          ":skPrefix": `CHAT_MESSAGE#${sessionId}`,
        },
        ScanIndexForward: true, // true para ordenar por SK (timestamp) ascendente
        Limit: 10, // Limitar al historial reciente para el contexto del LLM
      });
      const { Items: chatMessages } = await docClient.send(chatHistoryCommand);

      // Formatear el historial para el prompt del LLM
      chatHistoryContext = chatMessages
        ?.map(msg => `${msg.messageRole}: ${msg.messageContent}`)
        .join('\n') || '';
    }

    // 5. Construir el prompt aumentado para el modelo de chat
    const augmentedPrompt = `
      Eres un coach de fitness y nutrición experto y amigable.
      Analiza la siguiente información sobre el usuario y responde a su pregunta de forma concisa y útil.

      ---
      Contexto del Perfil del Usuario:
      ${profileContext}
      ---
      Contexto de sus Actividades Recientes (las más relevantes a su pregunta):
      - ${contextFromLogs.length > 0 ? contextFromLogs : "No hay actividades recientes relevantes."}
      ---
      Historial de la Conversación Actual:
      ${chatHistoryContext.length > 0 ? chatHistoryContext : "Esta es la primera pregunta en esta sesión."}
      ---

      Pregunta del Usuario: "${prompt}"

      Respuesta:
    `;

    // 6. Enviar a OpenAI para generar la respuesta final
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4', // Considera usar gpt-4 para mejor calidad en este tipo de prompts complejos
      messages: [{ role: 'user', content: augmentedPrompt }],
      temperature: 0.7,
      max_tokens: 500, // Limitar la longitud de la respuesta
    });

    return chatResponse.choices[0].message.content ?? "No pude generar una respuesta.";

  } catch (error) {
    console.error("Error en la función askCoach:", error);
    // Para AppSync, si lanzas un error, se mostrará en el campo 'errors' de la respuesta GraphQL
    throw new Error(`Ocurrió un error al procesar tu pregunta: ${error instanceof Error ? error.message : String(error)}`);
  }
};