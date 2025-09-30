"use client";

import { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Stack,
  Divider
} from '@mui/material';
import { updateUserProfile } from '../../profile/actions';
import { AuthUser } from 'aws-amplify/auth';
import { UserProfile } from '@/amplify/data/resource';
import ProfileHeader from './ProfileHeader';
import BMICard from './BMICard';
import PersonalInfoSection from './PersonalInfoSection';
import PhysicalInfoSection from './PhysicalInfoSection';
import GoalsSection from './GoalsSection';
import SaveButtonSection from './SaveButtonSection';

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

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <ProfileHeader 
        user={user}
        userName={formData.name}
        isEditing={isEditing}
        hasInitialProfile={!!initialProfile}
        onToggleEdit={() => setIsEditing(!isEditing)}
      />

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
      <BMICard 
        height={formData.height}
        weight={formData.weight}
        isEditing={isEditing}
      />

      {/* Formulario */}
      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <form
            action={handleSubmit}
            noValidate
          >
            <Stack spacing={{ xs: 3, sm: 4 }}>
              {/* Información Personal */}
              <PersonalInfoSection 
                formData={{
                  name: formData.name,
                  age: formData.age,
                  gender: formData.gender
                }}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
              />

              <Divider />

              {/* Información Física */}
              <PhysicalInfoSection 
                formData={{
                  height: formData.height,
                  weight: formData.weight
                }}
                isEditing={isEditing}
                onSliderChange={handleSliderChange}
              />

              <Divider />

              {/* Objetivos y Actividad */}
              <GoalsSection 
                formData={{
                  fitnessGoals: formData.fitnessGoals,
                  activityLevel: formData.activityLevel
                }}
                isEditing={isEditing}
                onSelectChange={handleSelectChange}
              />

              {/* Botón de guardar */}
              <SaveButtonSection 
                isEditing={isEditing}
                isSubmitting={isSubmitting}
                isFormValid={!!(formData.name.trim() && formData.fitnessGoals)}
              />
            </Stack>
          </form>
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