import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { createEmbedding } from './functions/createEmbedding/resource';

defineBackend({
  auth,
  data,
  createEmbedding
});
