'use client';

import {
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProfileSetupCTA() {
  const router = useRouter();
  const t = useTranslation();

  return (
    <Card sx={{ mt: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="h6" gutterBottom color="primary.main">
          {t('dashboard.profileSetup.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('dashboard.profileSetup.description')}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/profile')}
          startIcon={<Person />}
        >
          {t('dashboard.profileSetup.setupProfile')}
        </Button>
      </CardContent>
    </Card>
  );
}