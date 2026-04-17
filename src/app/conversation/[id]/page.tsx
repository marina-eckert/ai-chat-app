import { redirect } from 'next/navigation';
import ConversationLayout from '@/components/ConversationLayout';
import { getConversation } from '@/lib/db/conversations';
import { listMessages } from '@/lib/db/messages';
import { dbToUIMessage } from '@/lib/ai/adapters';

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversationId = Number(id);

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    redirect('/');
  }

  const messages = await listMessages(conversationId);
  const initialMessages = messages.map(dbToUIMessage);

  return (
    <ConversationLayout
      conversationId={conversationId}
      initialMessages={initialMessages}
    />
  );
}
