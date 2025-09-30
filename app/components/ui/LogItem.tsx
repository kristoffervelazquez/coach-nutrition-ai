'use client';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Restaurant, FitnessCenter } from '@mui/icons-material';
import { LogEntry } from '@/amplify/data/resource';

interface ParsedLogData {
  userNotes: string;
  mealType?: string;
  foods?: string;
  workoutType?: string;
  duration?: number;
  intensity?: string;
}

interface LogItemProps {
  log: LogEntry;
  index: number;
  totalItems: number;
}

export default function LogItem({ log, index, totalItems }: LogItemProps) {
  // Parsear datos estructurados del log
  let parsedData: ParsedLogData = { userNotes: log.notes || '' };
  try {
    parsedData = JSON.parse(log.notes || '{}') as ParsedLogData;
  } catch {
    // Si no es JSON válido, mantener las notas como están
  }

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'Sin fecha';
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLogIcon = (type?: string) => {
    return type === 'MEAL' ? <Restaurant color="primary" /> : <FitnessCenter color="secondary" />;
  };

  const getLogLabel = (type?: string) => {
    return type === 'MEAL' ? 'Comida' : 'Entrenamiento';
  };

  return (
    <ListItem
      key={log.PK + log.SK}
      divider={index < totalItems - 1}
      sx={{ px: 0 }}
    >
      <ListItemIcon>
        {getLogIcon(log.type)}
      </ListItemIcon>
      <ListItemText
        primary={
          <Box component={'span'} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography component="span" variant="subtitle2">
              {getLogLabel(log.type)}
            </Typography>
            {parsedData.mealType && (
              <Chip
                label={parsedData.mealType}
                size="small"
                color="success"
                variant="outlined"
              />
            )}
            {parsedData.workoutType && (
              <Chip
                label={parsedData.workoutType}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {log.calories && (
              <Chip
                label={`${log.calories} kcal`}
                size="small"
                variant="filled"
                sx={{ 
                  bgcolor: log.type === 'MEAL' ? 'success.main' : 'warning.main',
                  color: 'white',
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Box>
        }
        secondary={
          <Box component={'span'}>
            {parsedData.foods && (
              <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                <strong>Alimentos:</strong> {parsedData.foods}
              </Typography>
            )}
            {parsedData.duration && (
              <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                <strong>Duración:</strong> {parsedData.duration} min • <strong>Intensidad:</strong> {parsedData.intensity}
              </Typography>
            )}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {parsedData.userNotes || 'Sin notas adicionales'}
            </Typography>
            <Typography component="span" variant="caption" color="text.secondary">
              {formatDate(log.timestamp)}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
}