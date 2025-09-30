'use client';

import { Card, CardContent, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface EmptyLogsStateProps {
  searchTerm: string;
}

export default function EmptyLogsState({ searchTerm }: EmptyLogsStateProps) {
  const router = useRouter();

  return (
    <Card elevation={2}>
      <CardContent sx={{ 
        textAlign: 'center', 
        py: { xs: 4, sm: 8 },
        px: { xs: 2, sm: 3 }
      }}>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          No se encontraron registros
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          {searchTerm ? 'Intenta con una búsqueda diferente' : 'Comienza creando tu primer registro'}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => router.push('/log')}
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            px: { xs: 3, sm: 4 },
            py: { xs: 1, sm: 1.5 }
          }}
        >
          Crear Primer Registro
        </Button>
      </CardContent>
    </Card>
  );
}