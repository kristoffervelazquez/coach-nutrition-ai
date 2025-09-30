"use client";

import {
  Box,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Notes
} from '@mui/icons-material';

interface NotesInputProps {
  notes: string;
  onChange: (value: string) => void;
  logType: 'meal' | 'workout';
  color: string;
}

export default function NotesInput({ notes, onChange, logType, color }: NotesInputProps) {
  const isMeal = logType === 'meal';
  const title = isMeal ? 'Notas Personales' : 'Detalles del Entrenamiento';
  const description = isMeal 
    ? 'Comparte tu experiencia con esta comida' 
    : 'Describe cómo te sentiste durante el entrenamiento';
  const label = isMeal ? 'Experiencia y notas' : 'Detalles del entrenamiento';
  const exampleText = isMeal
    ? "Ej: Pechuga de pollo a la plancha (150g) con brócoli al vapor y arroz integral"
    : "Ej: Correr 30 minutos en el parque, ritmo moderado con intervalos de velocidad";

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notes color="action" />
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </Box>

      <TextField
        required
        fullWidth
        id="notes"
        name="notes"
        label={label}
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        multiline
        rows={3}
        variant="outlined"
        helperText={exampleText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
              <Notes color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: color + '.main',
            },
          },
        }}
      />
    </Box>
  );
}