'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { type Schema, UserProfile } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';
import { GetAuthCurrentUserServer } from '@/utils/utils';

// Función para obtener el perfil del usuario
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    return null;
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  try {
    const { data } = await cookieBasedClient.models.Item.get({
      PK: `USER#${user.userId}`,
      SK: 'PROFILE'
    });

    if (!data) {
      return null;
    }

    return data as unknown as UserProfile;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return null;
  }
}

// Función para crear o actualizar el perfil del usuario
export async function updateUserProfile(formData: FormData) {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    return redirect('/signup');
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  try {
    // Extraer datos del formulario
    const name = formData.get('name') as string;
    const ageStr = formData.get('age') as string;
    const heightStr = formData.get('height') as string;
    const weightStr = formData.get('weight') as string;
    const fitnessGoals = formData.get('fitnessGoals') as string;
    const activityLevel = formData.get('activityLevel') as string;
    const gender = formData.get('gender') as string;

    // Validaciones
    if (!name?.trim()) {
      throw new Error('El nombre es requerido.');
    }

    if (!ageStr || !heightStr || !weightStr) {
      throw new Error('Edad, altura y peso son requeridos.');
    }

    const age = parseInt(ageStr);
    const height = parseInt(heightStr);
    const weight = parseInt(weightStr);

    if (isNaN(age) || age < 10 || age > 120) {
      throw new Error('La edad debe estar entre 10 y 120 años.');
    }

    if (isNaN(height) || height < 100 || height > 250) {
      throw new Error('La altura debe estar entre 100 y 250 cm.');
    }

    if (isNaN(weight) || weight < 30 || weight > 300) {
      throw new Error('El peso debe estar entre 30 y 300 kg.');
    }

    if (!fitnessGoals?.trim()) {
      throw new Error('Los objetivos de fitness son requeridos.');
    }

    // Verificar si ya existe un perfil
    const existingProfile = await getUserProfile();

    const profileData = {
      PK: `USER#${user.userId}`,
      SK: 'PROFILE',
      userId: user.userId,
      type: 'PROFILE',
      email: user.signInDetails?.loginId || '',
      age,
      height,
      weight,
      fitnessGoals,
      // Campos adicionales para JSON string
      notes: JSON.stringify({
        name: name.trim(),
        activityLevel: activityLevel || 'moderate',
        gender: gender || 'not_specified',
        updatedAt: new Date().toISOString()
      })
    };

    if (existingProfile) {
      // Actualizar perfil existente
      await cookieBasedClient.models.Item.update({
        ...profileData
      });
    } else {
      // Crear nuevo perfil
      await cookieBasedClient.models.Item.create(profileData);
    }
    // Si llegamos aquí, se guardó exitosamente    
    redirect('/profile?success=Perfil actualizado con éxito');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // dejar que Next.js haga el redirect sin notificación
    }
    console.error('Error al actualizar perfil:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    redirect(`/profile?error=${encodeURIComponent(errorMessage)}`);
  }
}