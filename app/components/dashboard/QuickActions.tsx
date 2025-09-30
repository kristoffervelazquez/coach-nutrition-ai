'use client';

import { Box, Typography } from '@mui/material';
import { Restaurant, FitnessCenter, Chat, TrendingUp } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ActionCard from '../ui/ActionCard';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Registrar Comida',
      icon: <Restaurant />,
      color: 'primary.main',
      onClick: () => router.push('/log?type=meal')
    },
    {
      title: 'Entrenamientos',
      icon: <FitnessCenter />,
      color: 'secondary.main',
      onClick: () => router.push('/log?type=workout')
    },
    {
      title: 'Coach IA',
      icon: <Chat />,
      color: 'success.main',
      onClick: () => router.push('/chat')
    },
    {
      title: 'Analíticas',
      icon: <TrendingUp />,
      color: 'info.main',
      onClick: () => router.push('/analytics')
    }
  ];

  return (
    <>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Acciones Rápidas
      </Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
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