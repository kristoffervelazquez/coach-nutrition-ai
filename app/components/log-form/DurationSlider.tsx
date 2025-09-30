"use client";

import {
  Box,
  Typography,
  Slider
} from '@mui/material';
import {
  AccessTime
} from '@mui/icons-material';

interface DurationSliderProps {
  duration: number;
  onChange: (value: number) => void;
}

export default function DurationSlider({ duration, onChange }: DurationSliderProps) {
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTime color="action" />
        Duración del Entrenamiento
      </Typography>
      <Box sx={{ px: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {duration} minutos
        </Typography>
        <Slider
          value={duration}
          onChange={handleSliderChange}
          min={5}
          max={180}
          step={5}
          marks={[
            { value: 15, label: '15 min' },
            { value: 30, label: '30 min' },
            { value: 60, label: '1 hora' },
            { value: 120, label: '2 horas' },
          ]}
          valueLabelDisplay="auto"
          color="primary"
        />
      </Box>
    </Box>
  );
}