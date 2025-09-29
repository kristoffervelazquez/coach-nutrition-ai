import { Suspense } from 'react';
import { getUserProfile } from './actions';
import ProfileForm from './components/ProfileForm';
import { CircularProgress, Box } from '@mui/material';
import { GetAuthCurrentUserServer } from '@/utils/utils';
import { redirect } from 'next/navigation';

function Loading() {
  return (
    <div >
      cargando
    </div>
  );
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: { success?: string; error?: string };
}) {
  // Verificar autenticación
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    redirect('/signup');
  }

  // Obtener perfil del usuario
  const userProfile = await getUserProfile();

  return (
    <Suspense fallback={<Loading />}>
      <ProfileForm
        user={user}
        initialProfile={userProfile}
        success={searchParams?.success}
        error={searchParams?.error}
      />
    </Suspense>
  );
}