'use client';

import { Box } from '@mui/material';
import { UserProfile, LogEntry } from '@/amplify/data/resource';
import StatsCard from '../ui/StatsCard';

interface StatsOverviewProps {
  userProfile: UserProfile | null;
  recentLogs: LogEntry[];
}

export default function StatsOverview({ userProfile, recentLogs }: StatsOverviewProps) {
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
        label="Peso (kg)"
        color="primary"
      />
      <StatsCard
        value={userProfile.height}
        label="Altura (cm)"
        color="primary"
      />
      <StatsCard
        value={userProfile.age}
        label="Edad (años)"
        color="primary"
      />
      <StatsCard
        value={recentLogs.length}
        label="Registros"
        color="primary"
      />
    </Box>
  );
}