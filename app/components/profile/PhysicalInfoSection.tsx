'use client';

import {
  Box,
  Typography,
  Slider,
  Alert,
  Stack
} from '@mui/material';
import { FitnessCenter, Height, MonitorWeight, Info } from '@mui/icons-material';

interface PhysicalInfoSectionProps {
  formData: {
    height: number;
    weight: number;
  };
  isEditing: boolean;
  onSliderChange: (field: string) => (event: Event, newValue: number | number[]) => void;
}

export default function PhysicalInfoSection({ 
  formData, 
  isEditing, 
  onSliderChange 
}: PhysicalInfoSectionProps) {
  // Calcular IMC
  const bmi = (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1);
  
  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'info' as const };
    if (bmi < 25) return { label: 'Normal', color: 'success' as const };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'warning' as const };
    return { label: 'Obesidad', color: 'error' as const };
  };

  const bmiStatus = getBmiStatus(parseFloat(bmi));

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
        Información Física
      </Typography>

      <Stack spacing={4}>
        {/* Altura */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Height color="action" />
            Altura: {formData.height} cm
          </Typography>
          <Slider
            value={formData.height}
            onChange={onSliderChange('height')}
            min={100}
            max={250}
            step={1}
            disabled={!isEditing}
            marks={[
              { value: 150, label: '150cm' },
              { value: 170, label: '170cm' },
              { value: 190, label: '190cm' },
            ]}
            valueLabelDisplay="auto"
            color="primary"
          />
        </Box>

        {/* Peso */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonitorWeight color="action" />
            Peso: {formData.weight} kg
          </Typography>
          <Slider
            value={formData.weight}
            onChange={onSliderChange('weight')}
            min={30}
            max={200}
            step={1}
            disabled={!isEditing}
            marks={[
              { value: 50, label: '50kg' },
              { value: 70, label: '70kg' },
              { value: 100, label: '100kg' },
            ]}
            valueLabelDisplay="auto"
            color="success"
          />
        </Box>

        {/* IMC Info */}
        {isEditing && (
          <Alert severity="info" icon={<Info />}>
            <Typography variant="body2">
              <strong>Tu IMC actual:</strong> {bmi} ({bmiStatus.label})
            </Typography>
          </Alert>
        )}
      </Stack>
    </Box>
  );
}