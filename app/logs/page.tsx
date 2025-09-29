import { Suspense } from 'react';
import { getUserLogs, getUserStats } from '../log/actions';
import LogsView from './components/LogsView';
import { CircularProgress, Box } from '@mui/material';
import { LogEntry } from '@/amplify/data/resource';

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
      cargando...
    </div>
  );
}

export default async function LogsPage({
  searchParams,
}: {
  searchParams?: { success?: string; error?: string };
}) {
  const [logs, stats] = await Promise.all([
    getUserLogs(),
    getUserStats()
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <LogsView 
        initialLogs={logs as unknown as LogEntry[]} 
        stats={stats}
        success={searchParams?.success}
        error={searchParams?.error}
      />
    </Suspense>
  );
}