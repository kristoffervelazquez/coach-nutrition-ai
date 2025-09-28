import { redirect } from 'next/navigation'
import { GetAuthCurrentUserServer, runWithAmplifyServerContext } from '@/utils/utils'
import { generateClient } from "aws-amplify/data";
import type { Schema, UserProfile, LogEntry } from "@/amplify/data/resource";
import { cookies } from 'next/headers'
import Dashboard from './components/Dashboard'
import "@aws-amplify/ui-react/styles.css";



const client = generateClient<Schema>();

async function getUserProfile(userId: string) {
  try {
    const profile = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (context: any) => {
        const { data } = await client.models.Item.list({
          filter: {
            PK: { eq: `USER#${userId}` },
            SK: { eq: 'PROFILE' }
          }
        })
        return data[0] || null
      }
    })
    return profile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

async function getRecentLogs(userId: string, limit: number = 3) {
  try {
    const logs = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (context: any) => {
        const { data } = await client.models.Item.list({
          filter: {
            PK: { eq: `USER#${userId}` },
            SK: { beginsWith: 'LOG#' }
          }
        })
        return data
          .sort((a, b) => new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime())
          .slice(0, limit)
      }
    })
    return logs
  } catch (error) {
    console.error('Error fetching recent logs:', error)
    return []
  }
}

export default async function App() {
  // Verificar autenticación en el servidor
  const user = await GetAuthCurrentUserServer()

  // Si no está autenticado, redirigir al signup
  if (!user) {
    redirect('/signup')
  }

  // Obtener datos del usuario
  const userId = user.userId
  const userProfile = await getUserProfile(userId) as UserProfile | null
  const recentLogs = await getRecentLogs(userId) as unknown as LogEntry[]

  return (
    <Dashboard 
      user={user}
      userProfile={userProfile}
      recentLogs={recentLogs}
    />
  );
}
