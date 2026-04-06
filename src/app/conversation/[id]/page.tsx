import ConversationLayout from '@/components/ConversationLayout';

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConversationLayout conversationId={Number(id)} />;
}
