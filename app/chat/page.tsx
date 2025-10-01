import { Container, Paper } from '@mui/material';
import { GetAuthCurrentUserServer } from '@/utils/utils';
import { redirect } from 'next/navigation';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInterface from '../components/chat/ChatInterface';

export default async function ChatPage() {
  // Aseguramos que solo usuarios autenticados puedan acceder al chat
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    redirect('/signup');
  }

  return (
    <>
      <ChatHeader />
      {/* El componente de cliente se encargará de toda la lógica de la conversación */}
      <ChatInterface />
    </>
  );
}