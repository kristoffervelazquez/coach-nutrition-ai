'use client';

import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import {
  Restaurant,
  FitnessCenter,
  Delete,
  CalendarToday,
  AccessTime,
  LocalFireDepartment,
  FreeBreakfast,
  LunchDining,
  DinnerDining,
  LocalCafe,
  Cake,
  DirectionsRun,
  Pool,
  SelfImprovement,
  Speed
} from '@mui/icons-material';

interface LogEntry {
  PK: string;
  SK: string;
  type: 'MEAL' | 'WORKOUT';
  timestamp: string;
  notes: string;
  calories: number;
  parsedData: any;
}

interface LogListItemProps {
  log: LogEntry;
  isLast: boolean;
  onDelete: (logId: string, logType: string) => void;
}

// Iconos para tipos de comida
const getMealIcon = (mealType: string) => {
  const icons: { [key: string]: JSX.Element } = {
    breakfast: <FreeBreakfast />,
    lunch: <LunchDining />,
    dinner: <DinnerDining />,
    snack: <LocalCafe />,
    merienda: <Cake />,
  };
  return icons[mealType] || <Restaurant />;
};

// Iconos para tipos de entrenamiento
const getWorkoutIcon = (workoutType: string) => {
  const icons: { [key: string]: JSX.Element } = {
    cardio: <DirectionsRun />,
    strength: <FitnessCenter />,
    hiit: <Speed />,
    yoga: <SelfImprovement />,
    pilates: <SelfImprovement />,
    swimming: <Pool />,
  };
  return icons[workoutType] || <FitnessCenter />;
};

// Colores para intensidad
const getIntensityColor = (intensity: string) => {
  const colors: { [key: string]: string } = {
    low: '#4ecdc4',
    moderate: '#feca57',
    high: '#ff6b6b',
  };
  return colors[intensity] || '#4ecdc4';
};

export default function LogListItem({ log, isLast, onDelete }: LogListItemProps) {
  const logData = log.parsedData;

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <ListItem 
        alignItems="flex-start" 
        sx={{ 
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'flex-start' }
        }}
      >
        <ListItemAvatar 
          sx={{ 
            alignSelf: { xs: 'center', sm: 'flex-start' },
            mb: { xs: 2, sm: 0 },
            mr: { xs: 0, sm: 2 }
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: log.type === 'MEAL' ? 'success.main' : 'primary.main',
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 }
            }}
          >
            {log.type === 'MEAL' 
              ? getMealIcon(logData.mealType || '')
              : getWorkoutIcon(logData.workoutType || '')
            }
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          sx={{ 
            flex: 1,
            textAlign: { xs: 'center', sm: 'left' }
          }}
          primary={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              <Typography 
                variant="h6" 
                component="span"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                {log.type === 'MEAL' ? 'Comida' : 'Entrenamiento'}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}>
                {logData.mealType && (
                  <Chip 
                    size="small" 
                    label={logData.mealType} 
                    color="success" 
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                )}
                {logData.workoutType && (
                  <Chip 
                    size="small" 
                    label={logData.workoutType} 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                )}
                {logData.intensity && (
                  <Chip 
                    size="small" 
                    label={logData.intensity}
                    sx={{ 
                      bgcolor: getIntensityColor(logData.intensity), 
                      color: 'white',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  />
                )}
              </Box>
            </Box>
          }
          secondary={
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: 0.5
                }}
              >
                <CalendarToday sx={{ fontSize: { xs: 14, sm: 16 } }} />
                {formatDate(log.timestamp)}
              </Typography>
              
              {logData.foods && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  <strong>Alimentos:</strong> {logData.foods}
                </Typography>
              )}
              
              {logData.duration && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: 0.5
                  }}
                >
                  <AccessTime sx={{ fontSize: { xs: 14, sm: 16 } }} />
                  <strong>Duración:</strong> {logData.duration} minutos
                </Typography>
              )}
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: 0.5,
                  fontWeight: 'bold'
                }}
              >
                <LocalFireDepartment sx={{ fontSize: { xs: 14, sm: 16 } }} />
                {log.calories} kcal {log.type === 'MEAL' ? 'consumidas' : 'quemadas'}
              </Typography>
              
              {logData.userNotes && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    textAlign: { xs: 'center', sm: 'left' },
                    fontStyle: 'italic'
                  }}
                >
                  <strong>Notas:</strong> {logData.userNotes}
                </Typography>
              )}
            </Box>
          }
        />

        <ListItemSecondaryAction
          sx={{
            position: { xs: 'static', sm: 'absolute' },
            right: { sm: 16 },
            top: { sm: 16 },
            mt: { xs: 2, sm: 0 },
            alignSelf: { xs: 'center', sm: 'auto' }
          }}
        >
          <IconButton 
            edge="end" 
            aria-label="delete"
            onClick={() => onDelete(log.SK, log.type)}
            color="error"
            sx={{
              bgcolor: { xs: 'error.light', sm: 'transparent' },
              color: { xs: 'error.contrastText', sm: 'error.main' },
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              '&:hover': {
                bgcolor: 'error.main',
                color: 'error.contrastText'
              }
            }}
          >
            <Delete sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {!isLast && <Divider />}
    </Box>
  );
}