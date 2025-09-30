'use client';

import {
  Box,
  Typography,
  Avatar,
  Button
} from '@mui/material';
import { Person, Edit, Check } from '@mui/icons-material';
import { AuthUser } from 'aws-amplify/auth';

interface ProfileHeaderProps {
  user: AuthUser;
  userName: string;
  isEditing: boolean;
  hasInitialProfile: boolean;
  onToggleEdit: () => void;
}

export default function ProfileHeader({ 
  user, 
  userName, 
  isEditing, 
  hasInitialProfile, 
  onToggleEdit 
}: ProfileHeaderProps) {
  return (
    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            width: { xs: 56, sm: 64 }, 
            height: { xs: 56, sm: 64 },
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            <Person />
          </Avatar>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Mi Perfil
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {userName || 'Configura tu información personal'}
            </Typography>
          </Box>
        </Box>
        
        {hasInitialProfile && (
          <Button
            variant={isEditing ? "outlined" : "contained"}
            startIcon={isEditing ? <Check /> : <Edit />}
            onClick={onToggleEdit}
            sx={{ 
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </Button>
        )}
      </Box>
    </Box>
  );
}