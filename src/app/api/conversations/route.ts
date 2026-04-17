import { createConversation } from '@/lib/db/conversations';

export async function POST() {
  const conversation = await createConversation();
  return Response.json(conversation, { status: 201 });
}
