'use client';

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';

interface GoalsSectionProps {
  formData: {
    fitnessGoals: string;
    activityLevel: string;
  };
  isEditing: boolean;
  onSelectChange: (field: string) => (event: any) => void;
}

const FITNESS_GOALS = [
  'Perder peso',
  'Ganar músculo',
  'Mantener peso',
  'Mejorar resistencia',
  'Tonificar cuerpo',
  'Rehabilitación',
  'Bienestar general'
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentario', description: 'Poco o ningún ejercicio' },
  { value: 'light', label: 'Ligero', description: 'Ejercicio ligero 1-3 días/semana' },
  { value: 'moderate', label: 'Moderado', description: 'Ejercicio moderado 3-5 días/semana' },
  { value: 'active', label: 'Activo', description: 'Ejercicio intenso 6-7 días/semana' },
  { value: 'very_active', label: 'Muy Activo', description: 'Ejercicio muy intenso, trabajo físico' }
];

export default function GoalsSection({ 
  formData, 
  isEditing, 
  onSelectChange 
}: GoalsSectionProps) {
  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}
      >
        <FitnessCenter color="action" />
        Objetivos y Actividad
      </Typography>

      <Stack spacing={3}>
        <FormControl fullWidth disabled={!isEditing} required>
          <InputLabel>Objetivo principal</InputLabel>
          <Select
            value={formData.fitnessGoals}
            label="Objetivo principal"
            onChange={onSelectChange('fitnessGoals')}
            name="fitnessGoals"
          >
            {FITNESS_GOALS.map((goal) => (
              <MenuItem key={goal} value={goal}>
                {goal}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!isEditing}>
          <InputLabel>Nivel de actividad</InputLabel>
          <Select
            value={formData.activityLevel}
            label="Nivel de actividad"
            onChange={onSelectChange('activityLevel')}
            name="activityLevel"
          >
            {ACTIVITY_LEVELS.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                <Box>
                  <Typography variant="body1">{level.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {level.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}