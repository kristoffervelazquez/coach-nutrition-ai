"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  InputAdornment,
  Alert,
  Fade,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Slider
} from '@mui/material';
import {
  Restaurant,
  FitnessCenter,
  LocalFireDepartment,
  Notes,
  Save,
  Info,
  AccessTime,
  Speed,
  Category,
  FreeBreakfast,
  LunchDining,
  DinnerDining,
  LocalCafe,
  Cake,
  DirectionsRun,
  FitnessCenter as Strength,
  Pool,
  SelfImprovement,
  Speed as HIIT,
  Person
} from '@mui/icons-material';
import { createLog } from '../actions';

// Tipos de comida
const MEAL_TYPES = [
  { value: 'breakfast', label: 'Desayuno', icon: <FreeBreakfast /> },
  { value: 'lunch', label: 'Almuerzo', icon: <LunchDining /> },
  { value: 'dinner', label: 'Cena', icon: <DinnerDining /> },
  { value: 'snack', label: 'Snack', icon: <LocalCafe /> },
  { value: 'merienda', label: 'Merienda', icon: <Cake /> },
];

// Tipos de entrenamiento
const WORKOUT_TYPES = [
  { value: 'cardio', label: 'Cardio', icon: <DirectionsRun />, color: '#ff6b6b' },
  { value: 'strength', label: 'Fuerza', icon: <Strength />, color: '#4ecdc4' },
  { value: 'hiit', label: 'HIIT', icon: <HIIT />, color: '#45b7d1' },
  { value: 'yoga', label: 'Yoga', icon: <SelfImprovement />, color: '#96ceb4' },
  { value: 'pilates', label: 'Pilates', icon: <SelfImprovement />, color: '#feca57' },
  { value: 'swimming', label: 'Natación', icon: <Pool />, color: '#48dbfb' },
  { value: 'other', label: 'Otro', icon: <Person />, color: '#c8d6e5' },
];

// Niveles de intensidad
const INTENSITY_LEVELS = [
  { value: 'low', label: 'Baja', color: '#4ecdc4', description: 'Ejercicio ligero, conversación fácil' },
  { value: 'moderate', label: 'Moderada', color: '#feca57', description: 'Ejercicio moderado, algo de esfuerzo' },
  { value: 'high', label: 'Alta', color: '#ff6b6b', description: 'Ejercicio intenso, mucho esfuerzo' },
];

export default function LogForm({ logType }: { logType: 'meal' | 'workout' }) {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    calories: '',
    // Campos específicos para comidas
    mealType: '',
    foods: '',
    // Campos específicos para entrenamientos
    workoutType: '',
    duration: 30,
    intensity: 'moderate'
  });

  const isMeal = logType === 'meal';
  const icon = isMeal ? <Restaurant /> : <FitnessCenter />;
  const color = isMeal ? 'success' : 'primary';
  const title = isMeal ? 'Registrar Comida' : 'Registrar Entrenamiento';
  const subtitle = isMeal ? 'Anota los detalles de tu comida' : 'Registra tu actividad física';

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSliderChange = (field: string) => (event: Event, newValue: number | number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleSubmit = async (formDataObj: FormData) => {
    setIsSubmitting(true);
    
    // Agregar los campos adicionales al FormData
    formDataObj.append('mealType', formData.mealType);
    formDataObj.append('foods', formData.foods);
    formDataObj.append('workoutType', formData.workoutType);
    formDataObj.append('duration', formData.duration.toString());
    formDataObj.append('intensity', formData.intensity);
    
    await createLog(formDataObj);
    setIsSubmitting(false);
  };

  const exampleText = isMeal
    ? "Ej: Pechuga de pollo a la plancha (150g) con brócoli al vapor y arroz integral"
    : "Ej: Correr 30 minutos en el parque, ritmo moderado con intervalos de velocidad";

  const caloriesLabel = isMeal ? 'Calorías Consumidas' : 'Calorías Quemadas';
  const selectedIntensity = INTENSITY_LEVELS.find(level => level.value === formData.intensity);
  const selectedWorkoutType = WORKOUT_TYPES.find(type => type.value === formData.workoutType);

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header Card */}
        <Card elevation={2} sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'white', color: color + '.main', width: 56, height: 56 }}>
                {icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                  {subtitle}
                </Typography>
              </Box>
              <Chip
                label={isMeal ? "Nutrición" : "Ejercicio"}
                color={color}
                variant="filled"
                sx={{ bgcolor: 'white', color: color + '.main', fontWeight: 'bold' }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box
            component="form"
            action={handleSubmit}
            noValidate
            sx={{ width: '100%' }}
          >
            <input type="hidden" name="logType" value={logType} />

            <Stack spacing={3}>
              {/* Tipo específico (Comida o Entrenamiento) */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category color="action" />
                  {isMeal ? 'Tipo de Comida' : 'Tipo de Entrenamiento'}
                </Typography>
                
                {isMeal ? (
                  <FormControl fullWidth required>
                    <InputLabel>Selecciona el tipo de comida</InputLabel>
                    <Select
                      value={formData.mealType}
                      label="Selecciona el tipo de comida"
                      onChange={handleSelectChange('mealType')}
                      name="mealType"
                    >
                      {MEAL_TYPES.map((meal) => (
                        <MenuItem key={meal.value} value={meal.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {meal.icon}
                            <Typography>{meal.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {WORKOUT_TYPES.map((workout) => (
                      <Chip
                        key={workout.value}
                        icon={workout.icon}
                        label={workout.label}
                        clickable
                        color={formData.workoutType === workout.value ? 'primary' : 'default'}
                        variant={formData.workoutType === workout.value ? 'filled' : 'outlined'}
                        onClick={() => setFormData(prev => ({ ...prev, workoutType: workout.value }))}
                        sx={{
                          '&.MuiChip-filled': {
                            bgcolor: workout.color,
                            color: 'white',
                            '&:hover': {
                              bgcolor: workout.color,
                              filter: 'brightness(0.9)',
                            }
                          }
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Campos específicos para entrenamientos */}
              {!isMeal && (
                <>
                  {/* Duración */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime color="action" />
                      Duración del Entrenamiento
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {formData.duration} minutos
                      </Typography>
                      <Slider
                        value={formData.duration}
                        onChange={handleSliderChange('duration')}
                        min={5}
                        max={180}
                        step={5}
                        marks={[
                          { value: 15, label: '15 min' },
                          { value: 30, label: '30 min' },
                          { value: 60, label: '1 hora' },
                          { value: 120, label: '2 horas' },
                        ]}
                        valueLabelDisplay="auto"
                        color="primary"
                      />
                    </Box>
                  </Box>

                  {/* Intensidad */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Speed color="action" />
                      Intensidad del Entrenamiento
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {INTENSITY_LEVELS.map((level) => (
                        <Chip
                          key={level.value}
                          label={level.label}
                          clickable
                          color={formData.intensity === level.value ? 'primary' : 'default'}
                          variant={formData.intensity === level.value ? 'filled' : 'outlined'}
                          onClick={() => setFormData(prev => ({ ...prev, intensity: level.value }))}
                          sx={{
                            '&.MuiChip-filled': {
                              bgcolor: level.color,
                              color: 'white',
                              '&:hover': {
                                bgcolor: level.color,
                                filter: 'brightness(0.9)',
                              }
                            }
                          }}
                        />
                      ))}
                    </Stack>
                    {selectedIntensity && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">{selectedIntensity.description}</Typography>
                      </Alert>
                    )}
                  </Box>
                </>
              )}

              {/* Campo de alimentos (solo para comidas) */}
              {isMeal && (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Restaurant color="action" />
                      Alimentos Consumidos
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Lista detallada de los alimentos y sus porciones
                    </Typography>
                  </Box>
                  
                  <TextField
                    required
                    fullWidth
                    id="foods"
                    name="foods"
                    label="Descripción detallada de alimentos"
                    value={formData.foods}
                    onChange={handleInputChange('foods')}
                    multiline
                    rows={4}
                    variant="outlined"
                    helperText="Ej: Pechuga de pollo a la plancha (150g), Brócoli al vapor (100g), Arroz integral (80g)"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <Restaurant color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}

              {/* Description Field */}
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Notes color="action" />
                    {isMeal ? 'Notas Personales' : 'Detalles del Entrenamiento'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {isMeal ? 'Comparte tu experiencia con esta comida' : 'Describe cómo te sentiste durante el entrenamiento'}
                  </Typography>
                </Box>
                
                <TextField
                  required
                  fullWidth
                  id="notes"
                  name="notes"
                  label={`${isMeal ? 'Experiencia y notas' : 'Detalles del entrenamiento'}`}
                  value={formData.notes}
                  onChange={handleInputChange('notes')}
                  multiline
                  rows={3}
                  variant="outlined"
                  helperText={exampleText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <Notes color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: color + '.main',
                      },
                    },
                  }}
                />
              </Box>

              {/* Calories Field */}
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalFireDepartment color="action" />
                    {caloriesLabel}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Estimación aproximada en calorías
                  </Typography>
                </Box>

                <TextField
                  required
                  fullWidth
                  name="calories"
                  label={`${caloriesLabel} (aproximadas)`}
                  type="number"
                  id="calories"
                  value={formData.calories}
                  onChange={handleInputChange('calories')}
                  variant="outlined"
                  inputProps={{ min: 1, max: 5000 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalFireDepartment color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" color="text.secondary">kcal</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: color + '.main',
                      },
                    },
                  }}
                />
              </Box>

              {/* Info Alert */}
              <Box>
                <Alert 
                  severity="info" 
                  icon={<Info />}
                  sx={{ 
                    bgcolor: 'info.light', 
                    color: 'info.contrastText',
                    '& .MuiAlert-icon': { color: 'info.main' }
                  }}
                >
                  <Typography variant="body2">
                    💡 <strong>Consejo:</strong> {isMeal 
                      ? 'Incluye detalles sobre porciones, método de cocción y acompañamientos para un registro más preciso.'
                      : 'Anota la duración, intensidad y cualquier detalle relevante de tu entrenamiento.'
                    }
                  </Typography>
                </Alert>
              </Box>

              {/* Error Message */}
              {error && (
                <Box>
                  <Fade in={!!error}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="body2">{error}</Typography>
                    </Alert>
                  </Fade>
                </Box>
              )}

              {/* Submit Button */}
              <Box>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color={color}
                    disabled={
                      isSubmitting || 
                      !formData.notes.trim() || 
                      !formData.calories ||
                      (isMeal && (!formData.mealType || !formData.foods.trim())) ||
                      (!isMeal && !formData.workoutType)
                    }
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
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}