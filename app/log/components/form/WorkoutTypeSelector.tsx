"use client";

import {
  Box,
  Typography,
  Stack,
  Chip
} from '@mui/material';
import {
  Category,
  DirectionsRun,
  FitnessCenter as Strength,
  Pool,
  SelfImprovement,
  Speed as HIIT,
  Person
} from '@mui/icons-material';

// Tipos de entrenamiento
const WORKOUT_TYPES = [
  { value: 'cardio', label: 'Cardio', icon: <DirectionsRun />, color: '#ff6b6b' },
  { value: 'strength', label: 'Fuerza', icon: <Strength />, color: '#4ecdc4' },
  { value: 'hiit', label: 'HIIT', icon: <HIIT />, color: '#45b7d1' },
  { value: 'yoga', label: 'Yoga', icon: <SelfImprovement />, color: '#96ceb4' },
  { value: 'pilates', label: 'Pilates', icon: <SelfImprovement />, color: '#feca57' },
  { value: 'swimming', label: 'Natación', icon: <Pool />, color: '#48dbfb' },
  { value: 'other', label: 'Otro', icon: <Person />, color: '#c8d6e5' },
];

interface WorkoutTypeSelectorProps {
  workoutType: string;
  onChange: (value: string) => void;
}

export default function WorkoutTypeSelector({ workoutType, onChange }: WorkoutTypeSelectorProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Category color="action" />
        Tipo de Entrenamiento
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {WORKOUT_TYPES.map((workout) => (
          <Chip
            key={workout.value}
            icon={workout.icon}
            label={workout.label}
            clickable
            color={workoutType === workout.value ? 'primary' : 'default'}
            variant={workoutType === workout.value ? 'filled' : 'outlined'}
            onClick={() => onChange(workout.value)}
            sx={{
              '&.MuiChip-filled': {
                bgcolor: workout.color,
                color: 'white',
                '&:hover': {
                  bgcolor: workout.color,
                  filter: 'brightness(0.9)',
                }
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}