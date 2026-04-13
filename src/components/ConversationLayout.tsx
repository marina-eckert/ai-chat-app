'use client';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './sidebar/Sidebar';
import ChatPanel from './chat/ChatPanel';
import { getConversations } from '@/api/conversations';
import { useRouter } from 'next/navigation';

export default function ConversationLayout({
  conversationId,
}: {
  conversationId: number;
}) {
  const router = useRouter();

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={conversationId}
        onSelect={(id) => router.push(`/conversation/${id}`)}
      />
      <ChatPanel conversationId={conversationId} />
    </div>
  );
}
