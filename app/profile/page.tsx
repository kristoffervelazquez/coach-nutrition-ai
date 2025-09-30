import { Suspense } from 'react';
import { getUserProfile } from './actions';
import ProfileForm from '../components/profile/ProfileForm';
import { GetAuthCurrentUserServer } from '@/utils/utils';
import { redirect } from 'next/navigation';
import LogFormSkeleton from '../components/ui/skeletons/LogFormSkeleton';


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
    <Suspense fallback={<LogFormSkeleton />}>
      <ProfileForm
        user={user}
        initialProfile={userProfile}
        success={searchParams?.success}
        error={searchParams?.error}
      />
    </Suspense>
  );
}