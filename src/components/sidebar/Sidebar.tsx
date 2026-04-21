import { listConversations } from '@/lib/db/conversations';
import SidebarClient from './SidebarClient';

export default async function Sidebar({ activeId }: { activeId: number }) {
  const initialData = await listConversations();
  return <SidebarClient activeId={activeId} initialData={initialData} />;
}
