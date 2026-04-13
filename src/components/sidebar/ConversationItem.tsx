'use client';
type Conversation = {
  id: number;
  title: string;
};

export default function ConversationItem({
  convo,
  active,
  onClick,
  onDelete,
}: {
  convo: Conversation;
  active: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg ${
        active ? 'bg-gray-700' : 'hover:bg-gray-800'
      }`}
    >
      <button
        onClick={onClick}
        className="flex-1 text-left px-3 py-2 text-sm text-gray-400 hover:text-white"
      >
        {convo.title}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="px-2 py-2 text-gray-500 hover:text-red-400 text-xs"
        aria-label="Delete conversation"
      >
        ✕
      </button>
    </div>
  );
}
