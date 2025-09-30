'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatsCardProps {
  value: string | number;
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
  sx?: object;
}

export default function StatsCard({ value, label, color = 'primary', sx = {} }: StatsCardProps) {
  return (
    <Card sx={sx}>
      <CardContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h6" color={`${color}.main`}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}