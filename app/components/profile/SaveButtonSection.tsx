'use client';

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material';
import { Save } from '@mui/icons-material';

interface SaveButtonSectionProps {
  isEditing: boolean;
  isSubmitting: boolean;
  isFormValid: boolean;
}

export default function SaveButtonSection({ 
  isEditing, 
  isSubmitting, 
  isFormValid 
}: SaveButtonSectionProps) {
  if (!isEditing) return null;

  return (
    <Box sx={{ pt: 2 }}>
      <Divider sx={{ mb: 3 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting || !isFormValid}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 'bold',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              transform: 'none',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
        </Button>
      </Stack>
    </Box>
  );
}