'use client';

import { Box } from '@mui/material';
import { UserProfile, LogEntry } from '@/amplify/data/resource';
import StatsCard from '../ui/StatsCard';
import { useTranslation } from '../../hooks/useTranslation';

interface StatsOverviewProps {
  userProfile: UserProfile | null;
  recentLogs: LogEntry[];
}

export default function StatsOverview({ userProfile, recentLogs }: StatsOverviewProps) {
  const t = useTranslation();
  
  if (!userProfile) return null;

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
      gap: 2,
      mb: 4
    }}>
      <StatsCard
        value={userProfile.weight}
        label={t('dashboard.stats.weight')}
        color="primary"
      />
      <StatsCard
        value={userProfile.height}
        label={t('dashboard.stats.height')}
        color="primary"
      />
      <StatsCard
        value={userProfile.age}
        label={t('dashboard.stats.age')}
        color="primary"
      />
      <StatsCard
        value={recentLogs.length}
        label={t('dashboard.stats.records')}
        color="primary"
      />
    </Box>
  );
}