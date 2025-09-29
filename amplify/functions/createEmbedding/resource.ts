import { defineFunction } from '@aws-amplify/backend';

export const createEmbedding = defineFunction({
  name: 'createEmbeddingHandler',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
  environment: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
    PINECONE_API_KEY: process.env.PINECONE_API_KEY ?? '',
    PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT ?? '',
    PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME ?? '',
  },
});