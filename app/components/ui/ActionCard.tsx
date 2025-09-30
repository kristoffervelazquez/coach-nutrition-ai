'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';

interface ActionCardProps {
  title: string;
  icon: ReactNode;
  onClick: () => void;
  height?: number;
  color?: string;
}

export default function ActionCard({ 
  title, 
  icon, 
  onClick, 
  height = 140,
  color = 'primary.main'
}: ActionCardProps) {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        height,
        '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
      }}
      onClick={onClick}
    >
      <CardContent sx={{
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1
      }}>
        <Box sx={{ fontSize: 40, color, mx: 'auto' }}>
          {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={500}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}