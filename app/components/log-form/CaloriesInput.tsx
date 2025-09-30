"use client";

import {
  Box,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  LocalFireDepartment
} from '@mui/icons-material';

interface CaloriesInputProps {
  calories: string;
  onChange: (value: string) => void;
  logType: 'meal' | 'workout';
  color: string;
}

export default function CaloriesInput({ calories, onChange, logType, color }: CaloriesInputProps) {
  const isMeal = logType === 'meal';
  const caloriesLabel = isMeal ? 'Calorías Consumidas' : 'Calorías Quemadas';

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalFireDepartment color="action" />
          {caloriesLabel}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Estimación aproximada en calorías
        </Typography>
      </Box>

      <TextField
        required
        fullWidth
        name="calories"
        label={`${caloriesLabel} (aproximadas)`}
        type="number"
        id="calories"
        value={calories}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        inputProps={{ min: 1, max: 5000 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocalFireDepartment color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Typography variant="body2" color="text.secondary">kcal</Typography>
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