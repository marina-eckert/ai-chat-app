import 'server-only';
import { prisma } from '@/lib/prisma';
import type { DbRole, MessageDTO } from './types';

function toDTO(m: {
  id: number;
  role: string;
  content: string;
  createdAt: Date;
}): MessageDTO {
  return {
    id: m.id,
    role: m.role as DbRole,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  };
}

export async function listMessages(
  conversationId: number,
): Promise<MessageDTO[]> {
  const rows = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
  return rows.map(toDTO);
}

export async function appendMessage(params: {
  conversationId: number;
  role: DbRole;
  content: string;
}): Promise<MessageDTO> {
  const row = await prisma.message.create({
    data: {
      conversationId: params.conversationId,
      role: params.role,
      content: params.content,
    },
  });
  return toDTO(row);
}
