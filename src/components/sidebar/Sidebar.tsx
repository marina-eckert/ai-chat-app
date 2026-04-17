import { listConversations } from '@/lib/db/conversations';
import SidebarClient from './SidebarClient';

export default async function Sidebar({ activeId }: { activeId: number }) {
  const conversations = await listConversations();
  return (
    <SidebarClient initialConversations={conversations} activeId={activeId} />
  );
}
