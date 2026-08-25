import { Metadata } from 'next';
import ChatPageClient from './ChatPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Chat Support - LitigeFlow',
  description: 'Contactez notre équipe de support en direct',
};

export default function ChatPage() {
  return <ChatPageClient />;
}
