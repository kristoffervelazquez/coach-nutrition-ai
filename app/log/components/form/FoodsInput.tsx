"use client";

import {
  Box,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Restaurant
} from '@mui/icons-material';

interface FoodsInputProps {
  foods: string;
  onChange: (value: string) => void;
}

export default function FoodsInput({ foods, onChange }: FoodsInputProps) {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Restaurant color="action" />
          Alimentos Consumidos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Lista detallada de los alimentos y sus porciones
        </Typography>
      </Box>

      <TextField
        required
        fullWidth
        id="foods"
        name="foods"
        label="Descripción detallada de alimentos"
        value={foods}
        onChange={(e) => onChange(e.target.value)}
        multiline
        rows={4}
        variant="outlined"
        helperText="Ej: Pechuga de pollo a la plancha (150g), Brócoli al vapor (100g), Arroz integral (80g)"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
              <Restaurant color="action" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}