'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { type Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';
import { GetAuthCurrentUserServer } from '@/utils/utils';

// Función para eliminar un log
export async function deleteLogAction(formData: FormData) {
  const logId = formData.get('logId') as string;

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
    console.error('Error al eliminar log:', error);
    redirect('/logs?error=Error al eliminar el registro');
  }


}