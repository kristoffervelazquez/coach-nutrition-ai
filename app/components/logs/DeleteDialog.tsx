'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

interface DeleteDialogProps {
  open: boolean;
  logType: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteDialog({ open, logType, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: 'auto' }
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: { xs: '1.1rem', sm: '1.25rem' },
        pb: 1
      }}>
        ¿Eliminar registro?
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography sx={{ 
          fontSize: { xs: '0.875rem', sm: '1rem' },
          lineHeight: 1.5
        }}>
          Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este {logType === 'MEAL' ? 'registro de comida' : 'registro de entrenamiento'}?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 },
        gap: 1,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            order: { xs: 2, sm: 1 },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            order: { xs: 1, sm: 2 },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}