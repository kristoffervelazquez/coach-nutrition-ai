'use client';

import { Box, Typography } from '@mui/material';

interface LogsHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function LogsHeader({ 
  title = "Historial de Registros", 
  subtitle = "Revisa y administra todos tus registros de comidas y entrenamientos" 
}: LogsHeaderProps) {
  return (
    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}