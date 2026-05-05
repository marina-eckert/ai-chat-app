import 'server-only';
import { prisma } from '@/lib/prisma';
import type { ConversationDTO } from './types';

function toDTO(c: {
  id: number;
  title: string;
  createdAt: Date;
}): ConversationDTO {
  return {
    id: c.id,
    title: c.title,
    createdAt: c.createdAt.toISOString(),
  };
}

export async function listConversations(): Promise<ConversationDTO[]> {
  const rows = await prisma.conversation.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toDTO);
}

export async function getConversation(
  id: number,
): Promise<ConversationDTO | null> {
  const row = await prisma.conversation.findUnique({ where: { id } });
  return row ? toDTO(row) : null;
}

export async function createConversation(
  title: string = 'New Chat',
): Promise<ConversationDTO> {
  const row = await prisma.conversation.create({ data: { title } });
  return toDTO(row);
}

export async function deleteConversation(id: number): Promise<void> {
  await prisma.conversation.delete({ where: { id } });
}
