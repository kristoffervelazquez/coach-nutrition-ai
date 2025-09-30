'use client';

import {
  Box,
  Typography,
  Paper,
  Chip
} from '@mui/material';

interface BMICardProps {
  height: number;
  weight: number;
  isEditing: boolean;
}

export default function BMICard({ height, weight, isEditing }: BMICardProps) {
  // Calcular IMC
  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
  
  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'info' as const };
    if (bmi < 25) return { label: 'Normal', color: 'success' as const };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'warning' as const };
    return { label: 'Obesidad', color: 'error' as const };
  };

  const bmiStatus = getBmiStatus(parseFloat(bmi));

  if (isEditing) return null;

  return (
    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Resumen
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: { xs: 2, sm: 3 } 
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {Math.round(height / 170 * 25)} {/* Age placeholder */}
          </Typography>
          <Typography variant="body2" color="text.secondary">años</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
            {height}
          </Typography>
          <Typography variant="body2" color="text.secondary">cm</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
            {weight}
          </Typography>
          <Typography variant="body2" color="text.secondary">kg</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: bmiStatus.color + '.main' }}>
            {bmi}
          </Typography>
          <Typography variant="body2" color="text.secondary">IMC</Typography>
          <Chip 
            label={bmiStatus.label} 
            color={bmiStatus.color} 
            size="small" 
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>
    </Paper>
  );
}