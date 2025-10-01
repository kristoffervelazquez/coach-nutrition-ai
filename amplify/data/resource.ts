import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { askCoachHandler } from './../functions/askCoach/resource';


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

    // --Chat related fields --
    sessionId: a.string(),
    messageRole: a.string(),
    messageContent: a.string(),
    title: a.string(),

    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  })
    .identifier(['PK', 'SK'])

    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
    ]),

  askCoach: a.mutation()
    .arguments({
      prompt: a.string().required(),
      sessionId: a.string(), // Ahora la mutación puede recibir el sessionId
    })
    .returns(a.string())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(askCoachHandler))
}).authorization((allow) => [
  allow.resource(askCoachHandler).to(['listen', 'mutate', 'query'])
]);


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
  SK: `LOG#${string}`;
  type: 'MEAL' | 'WORKOUT';
  timestamp: string; // ISO string
  notes: string; // JSON string containing structured data
  calories: number;
};

// Tipos para los datos estructurados dentro de notes
export interface MealLogData {
  userNotes: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'merienda';
  foods: string;
}

export interface WorkoutLogData {
  userNotes: string;
  workoutType: 'cardio' | 'strength' | 'hiit' | 'yoga' | 'pilates' | 'swimming' | 'other';
  duration: number; // in minutes
  intensity: 'low' | 'moderate' | 'high';
}


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

