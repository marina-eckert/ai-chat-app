'use client';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConversationItem from './ConversationItem';
import { createConversation, deleteConversation } from '@/api/conversations';

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
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConvo) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      router.push(`/conversation/${newConvo.id}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (deletedId === activeId) {
        const remaining = conversations.filter((c) => c.id !== deletedId);
        if (remaining.length > 0) {
          router.push(`/conversation/${remaining[0].id}`);
        }
      }
    },
  });

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <button
        onClick={() => createMutation.mutate(undefined)}
        disabled={createMutation.isPending}
        className="bg-indigo-600 p-2 rounded hover:bg-indigo-700 disabled:opacity-50"
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
            onDelete={() => deleteMutation.mutate(c.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
