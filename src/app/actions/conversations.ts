'use server';

import { revalidatePath } from 'next/cache';
import {
  createConversation,
  deleteConversation,
} from '@/lib/db/conversations';
import type { ConversationDTO } from '@/lib/db/types';

export async function createConversationAction(): Promise<ConversationDTO> {
  const conversation = await createConversation('New Chat');
  revalidatePath('/', 'layout');
  return conversation;
}

export async function deleteConversationAction(id: number): Promise<void> {
  await deleteConversation(id);
  revalidatePath('/', 'layout');
}
