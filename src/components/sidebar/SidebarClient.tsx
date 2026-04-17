'use client';
import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ConversationItem from './ConversationItem';
import {
  createConversationAction,
  deleteConversationAction,
} from '@/app/actions/conversations';
import type { ConversationDTO } from '@/lib/db/types';

type Action =
  | { type: 'add'; conversation: ConversationDTO }
  | { type: 'delete'; id: number };

function reducer(
  state: ConversationDTO[],
  action: Action,
): ConversationDTO[] {
  switch (action.type) {
    case 'add':
      return [action.conversation, ...state];
    case 'delete':
      return state.filter((c) => c.id !== action.id);
  }
}

export default function SidebarClient({
  initialConversations,
  activeId,
}: {
  initialConversations: ConversationDTO[];
  activeId: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticConversations, applyOptimistic] = useOptimistic(
    initialConversations,
    reducer,
  );

  function handleCreate() {
    startTransition(async () => {
      const tempId = -Date.now();
      applyOptimistic({
        type: 'add',
        conversation: {
          id: tempId,
          title: 'New Chat',
          createdAt: new Date().toISOString(),
        },
      });
      const created = await createConversationAction();
      router.push(`/conversation/${created.id}`);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      applyOptimistic({ type: 'delete', id });
      await deleteConversationAction(id);
      if (id === activeId) {
        const remaining = optimisticConversations.filter((c) => c.id !== id);
        if (remaining.length > 0) {
          router.push(`/conversation/${remaining[0].id}`);
        }
      }
    });
  }

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <button
        onClick={handleCreate}
        disabled={isPending}
        className="bg-indigo-600 p-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        + New Chat
      </button>

      <nav className="flex flex-col gap-1">
        {optimisticConversations.map((c) => (
          <ConversationItem
            key={c.id}
            convo={c}
            active={c.id === activeId}
            onClick={() => router.push(`/conversation/${c.id}`)}
            onDelete={() => handleDelete(c.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
