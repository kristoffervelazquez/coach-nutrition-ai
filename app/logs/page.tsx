import { Suspense } from 'react';
import { getUserLogs, getUserStats } from '../log/actions';
import LogsView from '../components/logs/LogsView';
import LogsSkeleton from '../components/ui/skeletons/LogsSkeleton';
import { LogEntry } from '@/amplify/data/resource';

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
    <Suspense fallback={<LogsSkeleton />}>
      <LogsView 
        initialLogs={logs as unknown as LogEntry[]} 
        stats={stats}
        success={searchParams?.success}
        error={searchParams?.error}
      />
    </Suspense>
  );
}