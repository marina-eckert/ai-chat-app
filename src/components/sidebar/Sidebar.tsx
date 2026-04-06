'use client';
import { useRouter } from 'next/navigation';
import ConversationItem from './ConversationItem';

type Conversation = {
  id: number;
  title: string;
};

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: number;
  onSelect: (id: number) => void;
}) {
  const router = useRouter();

  async function handleNewChat() {
    const res = await fetch('/api/conversations', { method: 'POST' });
    const newConvo = await res.json();
    router.push(`/conversation/${newConvo.id}`);
  }

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <button
        onClick={handleNewChat}
        className="bg-indigo-600 p-2 rounded hover:bg-indigo-700"
      >
        + New Chat
      </button>

      <nav className="flex flex-col gap-1">
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            convo={c}
            active={c.id === activeId}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
