"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Stack
} from '@mui/material';
import { createLog } from '../../log/actions';

// Componentes del formulario
import LogHeader from './LogHeader';
import MealTypeSelector from './MealTypeSelector';
import WorkoutTypeSelector from './WorkoutTypeSelector';
import DurationSlider from './DurationSlider';
import IntensitySelector from './IntensitySelector';
import FoodsInput from './FoodsInput';
import NotesInput from './NotesInput';
import CaloriesInput from './CaloriesInput';
import FormActions from './FormActions';

export default function LogView({ logType }: { logType: 'meal' | 'workout' }) {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const success = searchParams.get('success');
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
  const color = isMeal ? 'success' : 'primary';

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (field: string) => (value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

  // Validación del formulario
  const isFormValid = Boolean(
    formData.notes.trim() &&
    formData.calories &&
    (isMeal ? (formData.mealType && formData.foods.trim()) : formData.workoutType)
  );

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <LogHeader logType={logType} />

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
              {isMeal ? (
                <MealTypeSelector
                  mealType={formData.mealType}
                  onChange={handleSelectChange('mealType')}
                />
              ) : (
                <WorkoutTypeSelector
                  workoutType={formData.workoutType}
                  onChange={handleSelectChange('workoutType')}
                />
              )}

              {/* Campos específicos para entrenamientos */}
              {!isMeal && (
                <>
                  <DurationSlider
                    duration={formData.duration}
                    onChange={handleSliderChange('duration')}
                  />
                  <IntensitySelector
                    intensity={formData.intensity}
                    onChange={handleSelectChange('intensity')}
                  />
                </>
              )}

              {/* Campo de alimentos (solo para comidas) */}
              {isMeal && (
                <FoodsInput
                  foods={formData.foods}
                  onChange={handleInputChange('foods')}
                />
              )}

              {/* Notas */}
              <NotesInput
                notes={formData.notes}
                onChange={handleInputChange('notes')}
                logType={logType}
                color={color}
              />

              {/* Calorías */}
              <CaloriesInput
                calories={formData.calories}
                onChange={handleInputChange('calories')}
                logType={logType}
                color={color}
              />

              {/* Acciones del formulario */}
              <FormActions
                isSubmitting={isSubmitting}
                isFormValid={isFormValid}
                logType={logType}
                color={color}
                error={error}
                success={success}
              />
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}