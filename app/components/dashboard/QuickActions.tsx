'use client';

import { Box, Typography } from '@mui/material';
import { Restaurant, FitnessCenter, Chat, TrendingUp } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ActionCard from '../ui/ActionCard';
import { useTranslation } from '../../hooks/useTranslation';

export default function QuickActions() {
  const router = useRouter();
  const t = useTranslation();

  const actions = [
    {
      title: t('dashboard.actions.logFood'),
      icon: <Restaurant />,
      color: 'primary.main',
      onClick: () => router.push('/log?type=meal')
    },
    {
      title: t('dashboard.actions.workout'),
      icon: <FitnessCenter />,
      color: 'secondary.main',
      onClick: () => router.push('/log?type=workout')
    },
    {
      title: t('dashboard.actions.aiCoach'),
      icon: <Chat />,
      color: 'success.main',
      onClick: () => router.push('/chat')
    },
  ];

  return (
    <>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        {t('dashboard.quickActions')}
      </Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            title={action.title}
            icon={action.icon}
            color={action.color}
            onClick={action.onClick}
          />
        ))}
      </Box>
    </>
  );
}