'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  createConversation,
  deleteConversation,
  getConversations,
} from '@/lib/api/conversations';
import type { ConversationDTO } from '@/lib/db/types';
import ConversationItem from './ConversationItem';

const KEY = ['conversations'] as const;

export default function SidebarClient({
  activeId,
  initialData,
}: {
  activeId: number;
  initialData: ConversationDTO[];
}) {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: conversations = [] } = useQuery({
    queryKey: KEY,
    queryFn: getConversations,
    initialData,
  });

  const createMutation = useMutation({
    mutationFn: createConversation,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: KEY });
      const previous = qc.getQueryData<ConversationDTO[]>(KEY) ?? [];
      const optimistic: ConversationDTO = {
        id: -Date.now(),
        title: 'New Chat',
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData<ConversationDTO[]>(KEY, [optimistic, ...previous]);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(KEY, ctx.previous);
    },
    onSuccess: (created) => {
      router.push(`/conversation/${created.id}`);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: KEY });
      const previous = qc.getQueryData<ConversationDTO[]>(KEY) ?? [];
      qc.setQueryData<ConversationDTO[]>(
        KEY,
        previous.filter((c) => c.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx) qc.setQueryData(KEY, ctx.previous);
    },
    onSuccess: (_data, deletedId) => {
      if (deletedId === activeId) {
        const remaining = (
          qc.getQueryData<ConversationDTO[]>(KEY) ?? []
        ).filter((c) => c.id !== deletedId);
        if (remaining.length > 0) {
          router.push(`/conversation/${remaining[0].id}`);
        }
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <button
        onClick={() => createMutation.mutate()}
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
            onClick={() => router.push(`/conversation/${c.id}`)}
            onDelete={() => deleteMutation.mutate(c.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
