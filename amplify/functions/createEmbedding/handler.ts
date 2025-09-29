import type { DynamoDBStreamEvent } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// Inicializa los clientes fuera del handler para reutilizarlos
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

export const handler = async (event: DynamoDBStreamEvent) => {
  console.log(`Procesando ${event.Records.length} registros del stream.`);

  for (const record of event.Records) {
    // Solo procesamos nuevos registros (INSERT)
    if (record.eventName === 'INSERT' && record.dynamodb?.NewImage) {
      const newItem = unmarshall(record.dynamodb.NewImage as { [key: string]: any });

      // Verificamos que sea un log y no otro tipo de dato
      if (newItem.PK?.startsWith('USER#') && newItem.SK?.startsWith('LOG#')) {
        const { userId, SK: logSK, notes, type, timestamp, calories } = newItem;

        if (!notes) {
          console.warn(`Log ${logSK} no tiene notas. Omitiendo embedding.`);
          continue;
        }

        try {
          // 1. Crear el embedding con OpenAI
          const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: notes,
          });
          const embedding = embeddingResponse.data[0].embedding;

          // 2. Extraer el ID único del log desde el SK
          const logId = logSK.split('#')[1];

          // 3. Subir el embedding y metadatos a Pinecone
          await pineconeIndex.namespace(userId).upsert([
            {
              id: logId,
              values: embedding,
              metadata: {
                dataType: type.toLowerCase(), // 'meal' o 'workout'
                timestamp,
                calories,
                originalNotes: notes,
              },
            },
          ]);

          console.log(`Embedding para el log ${logId} del usuario ${userId} fue creado y guardado en Pinecone.`);
        } catch (error) {
          console.error(`Error procesando el log ${logSK}:`, error);
        }
      }
    }
  }
};