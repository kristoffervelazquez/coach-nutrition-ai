"use client";

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  Restaurant,
  FitnessCenter,
  Delete,
  Add,
  Search,
  LocalFireDepartment,
  TrendingUp,
  TrendingDown,
  Balance,
  CalendarToday,
  AccessTime,
  Speed,
  Category,
  FreeBreakfast,
  LunchDining,
  DinnerDining,
  LocalCafe,
  Cake,
  DirectionsRun,
  Pool,
  SelfImprovement
} from '@mui/icons-material';
import { deleteLogAction } from '../actions';
import { useRouter } from 'next/navigation';

interface LogEntry {
  PK: string;
  SK: string;
  type: 'MEAL' | 'WORKOUT';
  timestamp: string;
  notes: string;
  calories: number;
  userId?: string;
}

interface Stats {
  total: {
    meals: number;
    workouts: number;
    caloriesConsumed: number;
    caloriesBurned: number;
    calorieBalance: number;
  };
  thisWeek: {
    meals: number;
    workouts: number;
    caloriesConsumed: number;
    caloriesBurned: number;
  };
}

interface LogsViewProps {
  initialLogs: LogEntry[];
  stats: Stats;
  success?: string;
  error?: string;
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

export default function LogsView({ initialLogs, stats, success, error }: LogsViewProps) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; logId: string; logType: string }>({
    open: false,
    logId: '',
    logType: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Parsear datos estructurados de los logs
  const parsedLogs = initialLogs.map(log => {
    try {
      const parsedNotes = JSON.parse(log.notes);
      return {
        ...log,
        parsedData: parsedNotes
      };
    } catch {
      // Si no es JSON válido, mantener las notas como están
      return {
        ...log,
        parsedData: { userNotes: log.notes }
      };
    }
  });

  // Filtrar logs según la pestaña activa
  const filteredLogs = parsedLogs.filter(log => {
    const matchesTab = currentTab === 0 || 
      (currentTab === 1 && log.type === 'MEAL') || 
      (currentTab === 2 && log.type === 'WORKOUT');
    
    const matchesSearch = !searchTerm || 
      log.parsedData.userNotes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.parsedData.foods?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.parsedData.workoutType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.parsedData.mealType?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleDeleteClick = (logId: string, logType: string) => {
    const id = logId.replace('LOG#', '');
    setDeleteDialog({ open: true, logId: id, logType });
  };

  const handleDeleteConfirm = async () => {
    try {
      const formData = new FormData();
      formData.append('logId', deleteDialog.logId);
      await deleteLogAction(formData);
      setSnackbar({ open: true, message: 'Registro eliminado con éxito', severity: 'success' });
      router.refresh();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el registro', severity: 'error' });
    }
    setDeleteDialog({ open: false, logId: '', logType: '' });
  };

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
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Historial de Registros
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          Revisa y administra todos tus registros de comidas y entrenamientos
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          lg: 'repeat(4, 1fr)' 
        }, 
        gap: { xs: 2, sm: 3 }, 
        mb: { xs: 3, sm: 4 } 
      }}>
        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Avatar sx={{ 
                bgcolor: 'success.main',
                width: { xs: 40, sm: 56 },
                height: { xs: 40, sm: 56 }
              }}>
                <Restaurant sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                  }}
                >
                  {stats.total.meals}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Comidas registradas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                width: { xs: 40, sm: 56 },
                height: { xs: 40, sm: 56 }
              }}>
                <FitnessCenter sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                  }}
                >
                  {stats.total.workouts}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Entrenamientos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Avatar sx={{ 
                bgcolor: 'warning.main',
                width: { xs: 40, sm: 56 },
                height: { xs: 40, sm: 56 }
              }}>
                <LocalFireDepartment sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                  }}
                >
                  {stats.total.caloriesConsumed.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Calorías consumidas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Avatar sx={{ 
                bgcolor: stats.total.calorieBalance > 0 ? 'error.main' : 'success.main',
                width: { xs: 40, sm: 56 },
                height: { xs: 40, sm: 56 }
              }}>
                {stats.total.calorieBalance > 0 ? 
                  <TrendingUp sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> : 
                  <TrendingDown sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                }
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                  }}
                >
                  {stats.total.calorieBalance > 0 ? '+' : ''}{stats.total.calorieBalance}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Balance calórico
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Alertas de success/error */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Controles */}
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 3, sm: 2 }}>
          {/* Barra de búsqueda */}
          <TextField
            placeholder="Buscar en registros..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: '100%',
              maxWidth: { sm: '350px' }
            }}
          />
          
          {/* Pestañas y botón */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Tabs 
              value={currentTab} 
              onChange={(e, newValue) => setCurrentTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                minHeight: { xs: 40, sm: 48 },
                '& .MuiTab-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  minHeight: { xs: 40, sm: 48 },
                  padding: { xs: '6px 8px', sm: '12px 16px' }
                }
              }}
            >
              <Tab label="Todos" />
              <Tab 
                label="Comidas"
                icon={<Restaurant sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />} 
                iconPosition="start" 
              />
              <Tab 
                label="Entrenamientos"
                icon={<FitnessCenter sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />} 
                iconPosition="start" 
              />
            </Tabs>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/log')}
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: { sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Nuevo Registro
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Lista de registros */}
      {filteredLogs.length === 0 ? (
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
      ) : (
        <List sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          p: { xs: 1, sm: 2 }
        }}>
          {filteredLogs.map((log, index) => {
            const isLast = index === filteredLogs.length - 1;
            const logData = log.parsedData;
            
            return (
              <Box key={log.SK}>
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
                      onClick={() => handleDeleteClick(log.SK, log.type)}
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
          })}
        </List>
      )}

      {/* Dialog de confirmación de eliminación */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, logId: '', logType: '' })}
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
            Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este {deleteDialog.logType === 'MEAL' ? 'registro de comida' : 'registro de entrenamiento'}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, logId: '', logType: '' })}
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              order: { xs: 2, sm: 1 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
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

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}