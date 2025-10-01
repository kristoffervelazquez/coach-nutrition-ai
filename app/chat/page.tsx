import { GetAuthCurrentUserServer } from '@/utils/utils';
import { redirect } from 'next/navigation';

import MultiChatInterface from '../components/chat/MultiChatInterface';

export default async function ChatPage() {
  const user = await GetAuthCurrentUserServer();
  if (!user) {
    redirect('/signup');
  }

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <MultiChatInterface />
    </div>
  );
}