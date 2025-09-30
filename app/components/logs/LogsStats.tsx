'use client';

import { Box, Card, CardContent, Avatar, Typography } from '@mui/material';
import {
  Restaurant,
  FitnessCenter,
  LocalFireDepartment,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';

interface Stats {
  total: {
    meals: number;
    workouts: number;
    caloriesConsumed: number;
    caloriesBurned: number;
    calorieBalance: number;
  };
  thisWeek: {
    meals: number;
    workouts: number;
    caloriesConsumed: number;
    caloriesBurned: number;
  };
}

interface LogsStatsProps {
  stats: Stats;
}

export default function LogsStats({ stats }: LogsStatsProps) {
  const statCards = [
    {
      title: 'Comidas registradas',
      value: stats.total.meals,
      icon: <Restaurant sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />,
      color: 'success.main'
    },
    {
      title: 'Entrenamientos',
      value: stats.total.workouts,
      icon: <FitnessCenter sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />,
      color: 'primary.main'
    },
    {
      title: 'Calorías consumidas',
      value: stats.total.caloriesConsumed.toLocaleString(),
      icon: <LocalFireDepartment sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />,
      color: 'warning.main'
    },
    {
      title: 'Balance calórico',
      value: `${stats.total.calorieBalance > 0 ? '+' : ''}${stats.total.calorieBalance}`,
      icon: stats.total.calorieBalance > 0 ? 
        <TrendingUp sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> : 
        <TrendingDown sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />,
      color: stats.total.calorieBalance > 0 ? 'error.main' : 'success.main'
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { 
        xs: '1fr', 
        sm: 'repeat(2, 1fr)', 
        lg: 'repeat(4, 1fr)' 
      }, 
      gap: { xs: 2, sm: 3 }, 
      mb: { xs: 3, sm: 4 } 
    }}>
      {statCards.map((stat, index) => (
        <Card key={index} elevation={2}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Avatar sx={{ 
                bgcolor: stat.color,
                width: { xs: 40, sm: 56 },
                height: { xs: 40, sm: 56 }
              }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {stat.title}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}