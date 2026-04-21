import ConversationItem from './ConversationItem';

export default function Sidebar({ conversations, activeId, onSelect }) {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <button className="bg-indigo-600 p-2 rounded">+ New Chat</button>

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
