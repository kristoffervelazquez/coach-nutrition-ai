"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Alert,
  Fade,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save,
  Info
} from '@mui/icons-material';

interface FormActionsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  logType: 'meal' | 'workout';
  color: string;
  error?: string | null;
  success?: string | null;
}

export default function FormActions({ 
  isSubmitting, 
  isFormValid, 
  logType, 
  color, 
  error, 
  success 
}: FormActionsProps) {
  const isMeal = logType === 'meal';

  return (
    <Box>
      {/* Info Alert */}
      <Alert
        severity="info"
        icon={<Info />}
        sx={{
          bgcolor: 'info.light',
          color: 'info.contrastText',
          '& .MuiAlert-icon': { color: 'info.main' },
          mb: 2
        }}
      >
        <Typography variant="body2">
          💡 <strong>Consejo:</strong> {isMeal
            ? 'Incluye detalles sobre porciones, método de cocción y acompañamientos para un registro más preciso.'
            : 'Anota la duración, intensidad y cualquier detalle relevante de tu entrenamiento.'
          }
        </Typography>
      </Alert>

      {/* Error Message */}
      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </Fade>
      )}

      {/* Success Message */}
      {success && (
        <Fade in={!!success}>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">{success}</Typography>
          </Alert>
        </Fade>
      )}

      {/* Submit Button */}
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          type="submit"
          variant="contained"
          size="large"
          color={color as any}
          disabled={isSubmitting || !isFormValid}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
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
          {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
        </Button>

        <Tooltip title="Los datos se guardarán de forma segura">
          <IconButton color="info">
            <Info />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}