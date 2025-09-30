'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { type Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';
import { GetAuthCurrentUserServer } from '@/utils/utils';

export async function createLog(formData: FormData) {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    return redirect('/signup');
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  const logType = formData.get('logType') as 'meal' | 'workout';

  try {
    const notes = formData.get('notes') as string;
    const caloriesStr = formData.get('calories') as string;

    // Campos específicos
    const mealType = formData.get('mealType') as string;
    const foods = formData.get('foods') as string;
    const workoutType = formData.get('workoutType') as string;
    const durationStr = formData.get('duration') as string;
    const intensity = formData.get('intensity') as string;

    // Validaciones básicas
    if (!notes?.trim() || !caloriesStr) {
      throw new Error('Todos los campos básicos son requeridos.');
    }

    // Validaciones específicas por tipo
    if (logType === 'meal') {
      if (!mealType || !foods?.trim()) {
        throw new Error('El tipo de comida y la descripción de alimentos son requeridos.');
      }
    } else if (logType === 'workout') {
      if (!workoutType || !durationStr || !intensity) {
        throw new Error('El tipo de entrenamiento, duración e intensidad son requeridos.');
      }
    }

    const calories = parseInt(caloriesStr);
    if (isNaN(calories) || calories < 0) {
      throw new Error('Las calorías deben ser un número positivo.');
    }

    const duration = durationStr ? parseInt(durationStr) : null;
    if (logType === 'workout' && (isNaN(duration!) || duration! < 1)) {
      throw new Error('La duración debe ser un número positivo.');
    }

    const timestamp = new Date().toISOString();
    const logId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Preparar datos estructurados para el campo notes
    const structuredData = {
      userNotes: notes,
      ...(logType === 'meal'
        ? { mealType, foods }
        : { workoutType, duration, intensity }
      )
    };

    await cookieBasedClient.models.Item.create({
      PK: `USER#${user.userId}`,
      SK: `LOG#${logId}`,
      userId: user.userId, // Clave para la regla de autorización "owner"
      type: logType.toUpperCase(),
      timestamp,
      // Almacenar datos estructurados en el campo notes como JSON
      notes: JSON.stringify(structuredData),
      calories,
    });

    console.log('Log creado:', {
      PK: `USER#${user.userId}`,
      SK: `LOG#${logId}`,
      userId: user.userId,
      type: logType.toUpperCase(),
      timestamp,
      notes: JSON.stringify(structuredData),
      calories,
    });
    // Si llegamos aquí, el log se creó exitosamente
    redirect(`/log?type=${logType}&success=Registro guardado con exito`);
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // dejar que Next.js haga el redirect sin notificación
    }
    console.error('Error al crear el log:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw redirect(`/log?type=${logType}&error=${encodeURIComponent(errorMessage)}`);
  }
}

// Función para obtener todos los logs del usuario
export async function getUserLogs() {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    return [];
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  try {
    const { data } = await cookieBasedClient.models.Item.list({
      filter: {
        PK: { eq: `USER#${user.userId}` },
        SK: { beginsWith: 'LOG#' }
      }
    });

    // Ordenar por timestamp descendente (más recientes primero)
    return data.sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
  } catch (error) {
    console.error('Error al obtener logs:', error);
    return [];
  }
}

// Función para eliminar un log
export async function deleteLog(logId: string) {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    return redirect('/signup');
  }

  const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  try {
    await cookieBasedClient.models.Item.delete({
      PK: `USER#${user.userId}`,
      SK: `LOG#${logId}`
    });

    // Si llegamos aquí, se eliminó exitosamente
    redirect('/logs?success=Registro eliminado con éxito');

  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // dejar que Next.js haga el redirect sin notificación
    }
    console.error('Error al eliminar log:', error);
    redirect('/logs?error=Error al eliminar el registro');
  }

}

// Función para obtener estadísticas del usuario
export async function getUserStats() {
  const logs = await getUserLogs();

  const meals = logs.filter(log => log.type === 'MEAL');
  const workouts = logs.filter(log => log.type === 'WORKOUT');

  const totalCaloriesConsumed = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
  const calorieBalance = totalCaloriesConsumed - totalCaloriesBurned;

  // Estadísticas de la semana actual
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp!);
    return logDate >= startOfWeek;
  });

  const weekMeals = weekLogs.filter(log => log.type === 'MEAL');
  const weekWorkouts = weekLogs.filter(log => log.type === 'WORKOUT');

  return {
    total: {
      meals: meals.length,
      workouts: workouts.length,
      caloriesConsumed: totalCaloriesConsumed,
      caloriesBurned: totalCaloriesBurned,
      calorieBalance,
    },
    thisWeek: {
      meals: weekMeals.length,
      workouts: weekWorkouts.length,
      caloriesConsumed: weekMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
      caloriesBurned: weekWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0),
    },
  };
}