
import { cookies } from 'next/headers'
import { getCurrentUser } from "aws-amplify/auth/server";
import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import outputs from '@/amplify_outputs.json'
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '@/amplify/data/resource';
// Configura Amplify explícitamente en el entorno server
Amplify.configure(outputs, { ssr: true })

export const { runWithAmplifyServerContext, createAuthRouteHandlers } = createServerRunner({
  config: outputs
})


export async function GetAuthCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (context) => getCurrentUser(context)
    })
    return currentUser
  } catch (err) {
    console.log(err)
  }
}

export const client = generateClient<Schema>({
  authMode: 'userPool', // Especifica el modo de autorización
});