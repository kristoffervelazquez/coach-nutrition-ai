"use client";

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Category,
  FreeBreakfast,
  LunchDining,
  DinnerDining,
  LocalCafe,
  Cake
} from '@mui/icons-material';

// Tipos de comida
const MEAL_TYPES = [
  { value: 'breakfast', label: 'Desayuno', icon: <FreeBreakfast /> },
  { value: 'lunch', label: 'Almuerzo', icon: <LunchDining /> },
  { value: 'dinner', label: 'Cena', icon: <DinnerDining /> },
  { value: 'snack', label: 'Snack', icon: <LocalCafe /> },
  { value: 'merienda', label: 'Merienda', icon: <Cake /> },
];

interface MealTypeSelectorProps {
  mealType: string;
  onChange: (value: string) => void;
}

export default function MealTypeSelector({ mealType, onChange }: MealTypeSelectorProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Category color="action" />
        Tipo de Comida
      </Typography>

      <FormControl fullWidth required>
        <InputLabel>Selecciona el tipo de comida</InputLabel>
        <Select
          value={mealType}
          label="Selecciona el tipo de comida"
          onChange={(e) => onChange(e.target.value)}
          name="mealType"
        >
          {MEAL_TYPES.map((meal) => (
            <MenuItem key={meal.value} value={meal.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {meal.icon}
                <Typography>{meal.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}