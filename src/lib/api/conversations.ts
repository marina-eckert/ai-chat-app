import type { ConversationDTO } from '@/lib/db/types';

export async function getConversations(): Promise<ConversationDTO[]> {
  const res = await fetch('/api/conversations');
  if (!res.ok) throw new Error('Failed to load conversations');
  return res.json();
}

export async function createConversation(): Promise<ConversationDTO> {
  const res = await fetch('/api/conversations', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to create conversation');
  return res.json();
}

export async function deleteConversation(id: number): Promise<void> {
  const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete conversation');
}
