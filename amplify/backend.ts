import { askCoachHandler } from './functions/askCoach/resource';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { createEmbedding } from './functions/createEmbedding/resource';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { EventSourceMapping, StartingPosition } from 'aws-cdk-lib/aws-lambda';

const backend = defineBackend({
  auth,
  data,
  createEmbedding,
  askCoachHandler,
});

const itemTable = backend.data.resources.tables["Item"];

const policy = new Policy(
  Stack.of(itemTable),
  "CreateEmbeddingStreamingPolicy",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: ["*"],
      }),
    ],
  }
);

backend.createEmbedding.resources.lambda.role?.attachInlinePolicy(policy);

const mapping = new EventSourceMapping(
  Stack.of(itemTable),
  "CreateEmbeddingItemEventStreamMapping",
  {
    target: backend.createEmbedding.resources.lambda,
    eventSourceArn: itemTable.tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

mapping.node.addDependency(policy);

const askCoachPolicy = new Policy(
  Stack.of(itemTable), // Asocia la política al mismo Stack que la tabla
  "AskCoachDynamoDBReadPolicy",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:Query"], // Permisos de lectura
        // Concede acceso a la tabla y a todos sus índices
        resources: [itemTable.tableArn, `${itemTable.tableArn}/index/*`],
      }),
    ],
  }
);

// 2. Adjunta la política al rol de la función Lambda
backend.askCoachHandler.resources.lambda.role?.attachInlinePolicy(askCoachPolicy);