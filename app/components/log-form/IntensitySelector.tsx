"use client";

import {
  Box,
  Typography,
  Stack,
  Chip,
  Alert
} from '@mui/material';
import {
  Speed
} from '@mui/icons-material';

// Niveles de intensidad
const INTENSITY_LEVELS = [
  { value: 'low', label: 'Baja', color: '#4ecdc4', description: 'Ejercicio ligero, conversación fácil' },
  { value: 'moderate', label: 'Moderada', color: '#feca57', description: 'Ejercicio moderado, algo de esfuerzo' },
  { value: 'high', label: 'Alta', color: '#ff6b6b', description: 'Ejercicio intenso, mucho esfuerzo' },
];

interface IntensitySelectorProps {
  intensity: string;
  onChange: (value: string) => void;
}

export default function IntensitySelector({ intensity, onChange }: IntensitySelectorProps) {
  const selectedIntensity = INTENSITY_LEVELS.find(level => level.value === intensity);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Speed color="action" />
        Intensidad del Entrenamiento
      </Typography>
      <Stack direction="row" spacing={1}>
        {INTENSITY_LEVELS.map((level) => (
          <Chip
            key={level.value}
            label={level.label}
            clickable
            color={intensity === level.value ? 'primary' : 'default'}
            variant={intensity === level.value ? 'filled' : 'outlined'}
            onClick={() => onChange(level.value)}
            sx={{
              '&.MuiChip-filled': {
                bgcolor: level.color,
                color: 'white',
                '&:hover': {
                  bgcolor: level.color,
                  filter: 'brightness(0.9)',
                }
              }
            }}
          />
        ))}
      </Stack>
      {selectedIntensity && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">{selectedIntensity.description}</Typography>
        </Alert>
      )}
    </Box>
  );
}