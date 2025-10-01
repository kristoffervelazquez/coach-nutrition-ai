// amplify/functions/askCoach/resource.ts
import { defineFunction, secret } from '@aws-amplify/backend';

export const askCoachHandler = defineFunction({
  name: 'askCoachHandler',
  entry: './handler.ts',
  timeoutSeconds: 90,
  memoryMB: 1024, // Aumentar memoria para manejar OpenAI y Pinecone
  environment: {
    OPENAI_API_KEY: secret('OPENAI_API_KEY'),
    PINECONE_API_KEY: secret('PINECONE_API_KEY'),
    PINECONE_ENVIRONMENT: secret('PINECONE_ENVIRONMENT'),
    PINECONE_INDEX_NAME: secret('PINECONE_INDEX_NAME'),
  },
});