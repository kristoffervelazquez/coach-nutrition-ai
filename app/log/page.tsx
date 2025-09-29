import { Suspense } from 'react';
import LogForm from './components/LogForm';


// Un componente de carga simple para el fallback de Suspense
function Loading() {
  return <div>Cargando...</div>;
}

export default function LogPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const logType = searchParams?.type === 'workout' ? 'workout' : 'meal';

  return (

    <Suspense fallback={<Loading />}>
      {/* Pasamos el tipo de log al formulario */}
      <LogForm logType={logType} />
    </Suspense>

  );
}