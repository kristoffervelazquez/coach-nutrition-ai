'use client';

import {
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function ProfileSetupCTA() {
  const router = useRouter();

  return (
    <Card sx={{ mt: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="h6" gutterBottom color="primary.main">
          Completa tu perfil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Añade tu información personal para obtener recomendaciones más precisas
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/profile')}
          startIcon={<Person />}
        >
          Configurar Perfil
        </Button>
      </CardContent>
    </Card>
  );
}