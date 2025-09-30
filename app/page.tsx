import { redirect } from 'next/navigation'
import { GetAuthCurrentUserServer, runWithAmplifyServerContext, client } from '@/utils/utils'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import type { Schema, UserProfile, LogEntry } from "@/amplify/data/resource";
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import Dashboard from './components/dashboard/Dashboard'
import DashboardSkeleton from './components/ui/skeletons/DashboardSkeleton'
import "@aws-amplify/ui-react/styles.css";
import outputs from '@/amplify_outputs.json';

const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies, // Pasa las cookies directamente
});

async function getRecentLogs(userId: string, limit: number = 3): Promise<any[]> {
  try {

    const { data } = await cookieBasedClient.models.Item.list({
      filter: {
        PK: { eq: `USER#${userId}` },
        SK: { beginsWith: 'LOG#' }
      }
    });

    return data
      .slice(0, limit);

  } catch (error) {
    console.error('Error fetching user logs:', error);
    return [];
  }
}

async function getUserProfile(userId: string) {
  // same as above, but for user profile
  try {
    const { data } = await cookieBasedClient.models.Item.list({
      filter: {
        PK: { eq: `USER#${userId}` },
        SK: { eq: 'PROFILE' }
      }
    });
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
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
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard
        user={user}
        userProfile={userProfile}
        recentLogs={recentLogs}
      />
    </Suspense>
  );
}
