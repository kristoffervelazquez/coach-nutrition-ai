"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import {
  Restaurant,
  FitnessCenter
} from '@mui/icons-material';

interface LogHeaderProps {
  logType: 'meal' | 'workout';
}

export default function LogHeader({ logType }: LogHeaderProps) {
  const isMeal = logType === 'meal';
  const icon = isMeal ? <Restaurant /> : <FitnessCenter />;
  const color = isMeal ? 'success' : 'primary';
  const title = isMeal ? 'Registrar Comida' : 'Registrar Entrenamiento';
  const subtitle = isMeal ? 'Anota los detalles de tu comida' : 'Registra tu actividad física';
  const chipLabel = isMeal ? "Nutrición" : "Ejercicio";

  return (
    <Card elevation={2} sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: color + '.main', width: 56, height: 56 }}>
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
              {subtitle}
            </Typography>
          </Box>
          <Chip
            label={chipLabel}
            color={color}
            variant="filled"
            sx={{ bgcolor: 'white', color: color + '.main', fontWeight: 'bold' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}