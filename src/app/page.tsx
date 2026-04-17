import { redirect } from 'next/navigation';
import {
  createConversation,
  listConversations,
} from '@/lib/db/conversations';

export default async function Home() {
  const conversations = await listConversations();
  const target = conversations[0] ?? (await createConversation('New Chat'));
  redirect(`/conversation/${target.id}`);
}
