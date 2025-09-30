import { Suspense } from 'react';
import LogView from '../components/log-form/LogView';
import LogFormSkeleton from '../components/ui/skeletons/LogFormSkeleton';

export default function LogPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const logType = searchParams?.type === 'workout' ? 'workout' : 'meal';

  return (
    <Suspense fallback={<LogFormSkeleton />}>
      <LogView logType={logType} />
    </Suspense>
  );
}