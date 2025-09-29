import { type ClientSchema, a, defineData } from "@aws-amplify/backend";


const schema = a.schema({
  Item: a.model({

    PK: a.string().required(),
    SK: a.string().required(),
    userId: a.string(),
    type: a.string(),

    email: a.string(),
    age: a.integer(),
    height: a.integer(),
    weight: a.integer(),
    fitnessGoals: a.string(),

    timestamp: a.string(),
    notes: a.string(),
    calories: a.integer(),

    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  })
    .identifier(['PK', 'SK'])

    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
    ]),
});


export type UserProfile = ClientSchema<typeof schema>['Item'] & {
  PK: `USER#${string}`;
  SK: 'PROFILE';
  age: number;
  height: number;
  weight: number;
  fitnessGoals: string;
  email?: string;
};

export type LogEntry = ClientSchema<typeof schema>['Item'] & {
  PK: `USER#${string}`;
  SK: `LOG#${'MEAL' | 'WORKOUT'}#${string}`;
  type: 'MEAL' | 'WORKOUT';
  timestamp: string; // ISO string
  notes: string;
  calories: number;
};


export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

