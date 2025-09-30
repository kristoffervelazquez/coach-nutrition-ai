'use client';

import {
  Box,
  Avatar,
  Typography,
  Button
} from '@mui/material';
import { Person, Logout } from '@mui/icons-material';
import { AuthUser, signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

interface UserHeaderProps {
  user: AuthUser;
}

export default function UserHeader({ user }: UserHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/signup');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Box sx={{
      mb: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          {user.signInDetails?.loginId?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Hola, {user.signInDetails?.loginId?.split('@')[0] || 'Usuario'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => router.push('/profile')}
          startIcon={<Person />}
          sx={{ mr: 1 }}
        >
          Mi Perfil
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSignOut}
          startIcon={<Logout />}
          size="small"
        >
          Salir
        </Button>
      </Box>
    </Box>
  );
}