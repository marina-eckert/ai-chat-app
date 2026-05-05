import { NextRequest } from 'next/server';
import { deleteConversation } from '@/lib/db/conversations';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteConversation(Number(id));
  return new Response(null, { status: 204 });
}
