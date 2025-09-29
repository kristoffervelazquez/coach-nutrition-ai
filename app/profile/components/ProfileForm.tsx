"use client";

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
  Stack,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Divider,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Height,
  MonitorWeight,
  Today,
  Save,
  Edit,
  Check,
  Info,
  Male,
  Female,
  QuestionMark
} from '@mui/icons-material';
import { updateUserProfile } from '../actions';
import { AuthUser } from 'aws-amplify/auth';
import { UserProfile } from '@/amplify/data/resource';

interface ProfileFormProps {
  user: AuthUser;
  initialProfile: UserProfile | null;
  success?: string;
  error?: string;
}

interface ParsedProfileData {
  name?: string;
  activityLevel?: string;
  gender?: string;
  updatedAt?: string;
}

const FITNESS_GOALS = [
  'Perder peso',
  'Ganar músculo',
  'Mantener peso',
  'Mejorar resistencia',
  'Tonificar cuerpo',
  'Rehabilitación',
  'Bienestar general'
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentario', description: 'Poco o ningún ejercicio' },
  { value: 'light', label: 'Ligero', description: 'Ejercicio ligero 1-3 días/semana' },
  { value: 'moderate', label: 'Moderado', description: 'Ejercicio moderado 3-5 días/semana' },
  { value: 'active', label: 'Activo', description: 'Ejercicio intenso 6-7 días/semana' },
  { value: 'very_active', label: 'Muy Activo', description: 'Ejercicio muy intenso, trabajo físico' }
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino', icon: <Male /> },
  { value: 'female', label: 'Femenino', icon: <Female /> },
  { value: 'not_specified', label: 'Prefiero no especificar', icon: <QuestionMark /> }
];

export default function ProfileForm({ user, initialProfile, success, error }: ProfileFormProps) {
  // Parsear datos adicionales del perfil
  let parsedData: ParsedProfileData = {};
  try {
    if (initialProfile && (initialProfile as any).notes) {
      parsedData = JSON.parse((initialProfile as any).notes);
    }
  } catch {
    // Si no es JSON válido, usar valores por defecto
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(!initialProfile); // Si no hay perfil, entrar en modo edición
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    name: parsedData.name || user.signInDetails?.loginId?.split('@')[0] || '',
    age: initialProfile?.age || 25,
    height: initialProfile?.height || 170,
    weight: initialProfile?.weight || 70,
    fitnessGoals: initialProfile?.fitnessGoals || '',
    activityLevel: parsedData.activityLevel || 'moderate',
    gender: parsedData.gender || 'not_specified'
  });

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
    
    // Agregar todos los campos al FormData
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value.toString());
    });
    
    try {
      await updateUserProfile(formDataObj);
      setSnackbar({ open: true, message: 'Perfil actualizado con éxito', severity: 'success' });
      setIsEditing(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar el perfil', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular IMC
  const bmi = (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1);
  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'info' as const };
    if (bmi < 25) return { label: 'Normal', color: 'success' as const };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'warning' as const };
    return { label: 'Obesidad', color: 'error' as const };
  };

  const bmiStatus = getBmiStatus(parseFloat(bmi));

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
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
                {formData.name || 'Configura tu información personal'}
              </Typography>
            </Box>
          </Box>
          
          {initialProfile && (
            <Button
              variant={isEditing ? "outlined" : "contained"}
              startIcon={isEditing ? <Check /> : <Edit />}
              onClick={() => setIsEditing(!isEditing)}
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

      {/* Alertas de success/error */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {decodeURIComponent(success)}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {decodeURIComponent(error)}
        </Alert>
      )}

      {/* Estadísticas rápidas */}
      {!isEditing && initialProfile && (
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Resumen
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: { xs: 2, sm: 3 } 
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formData.age}
              </Typography>
              <Typography variant="body2" color="text.secondary">años</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {formData.height}
              </Typography>
              <Typography variant="body2" color="text.secondary">cm</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {formData.weight}
              </Typography>
              <Typography variant="body2" color="text.secondary">kg</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: bmiStatus.color + '.main' }}>
                {bmi}
              </Typography>
              <Typography variant="body2" color="text.secondary">IMC</Typography>
              <Chip 
                label={bmiStatus.label} 
                color={bmiStatus.color} 
                size="small" 
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
        </Paper>
      )}

      {/* Formulario */}
      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box
            component="form"
            action={handleSubmit}
            noValidate
            sx={{ width: '100%' }}
          >
            <Stack spacing={{ xs: 3, sm: 4 }}>
              {/* Información Personal */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  <Person color="action" />
                  Información Personal
                </Typography>
                
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    disabled={!isEditing}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Tu nombre será usado para personalizar la experiencia"
                  />

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
                    gap: 3 
                  }}>
                    <TextField
                      fullWidth
                      label="Edad"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange('age')}
                      disabled={!isEditing}
                      required
                      inputProps={{ min: 10, max: 120 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Today color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position="end">años</InputAdornment>
                      }}
                    />

                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Género</InputLabel>
                      <Select
                        value={formData.gender}
                        label="Género"
                        onChange={handleSelectChange('gender')}
                        name="gender"
                      >
                        {GENDER_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {option.icon}
                              <Typography>{option.label}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Información Física */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  <FitnessCenter color="action" />
                  Información Física
                </Typography>

                <Stack spacing={4}>
                  {/* Altura */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Height color="action" />
                      Altura: {formData.height} cm
                    </Typography>
                    <Slider
                      value={formData.height}
                      onChange={handleSliderChange('height')}
                      min={100}
                      max={250}
                      step={1}
                      disabled={!isEditing}
                      marks={[
                        { value: 150, label: '150cm' },
                        { value: 170, label: '170cm' },
                        { value: 190, label: '190cm' },
                      ]}
                      valueLabelDisplay="auto"
                      color="primary"
                    />
                  </Box>

                  {/* Peso */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MonitorWeight color="action" />
                      Peso: {formData.weight} kg
                    </Typography>
                    <Slider
                      value={formData.weight}
                      onChange={handleSliderChange('weight')}
                      min={30}
                      max={200}
                      step={1}
                      disabled={!isEditing}
                      marks={[
                        { value: 50, label: '50kg' },
                        { value: 70, label: '70kg' },
                        { value: 100, label: '100kg' },
                      ]}
                      valueLabelDisplay="auto"
                      color="success"
                    />
                  </Box>

                  {/* IMC Info */}
                  {isEditing && (
                    <Alert severity="info" icon={<Info />}>
                      <Typography variant="body2">
                        <strong>Tu IMC actual:</strong> {bmi} ({bmiStatus.label})
                      </Typography>
                    </Alert>
                  )}
                </Stack>
              </Box>

              <Divider />

              {/* Objetivos y Actividad */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  <FitnessCenter color="action" />
                  Objetivos y Actividad
                </Typography>

                <Stack spacing={3}>
                  <FormControl fullWidth disabled={!isEditing} required>
                    <InputLabel>Objetivo principal</InputLabel>
                    <Select
                      value={formData.fitnessGoals}
                      label="Objetivo principal"
                      onChange={handleSelectChange('fitnessGoals')}
                      name="fitnessGoals"
                    >
                      {FITNESS_GOALS.map((goal) => (
                        <MenuItem key={goal} value={goal}>
                          {goal}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Nivel de actividad</InputLabel>
                    <Select
                      value={formData.activityLevel}
                      label="Nivel de actividad"
                      onChange={handleSelectChange('activityLevel')}
                      name="activityLevel"
                    >
                      {ACTIVITY_LEVELS.map((level) => (
                        <MenuItem key={level.value} value={level.value}>
                          <Box>
                            <Typography variant="body1">{level.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {level.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              {/* Botón de guardar */}
              {isEditing && (
                <Box sx={{ pt: 2 }}>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting || !formData.name.trim() || !formData.fitnessGoals}
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
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

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