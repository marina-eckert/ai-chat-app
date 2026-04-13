'use client';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage } from '@/api/messages';
import Message from './Message';
import InputForm from './InputForm';

type ChatMessage = {
  role: string;
  content: string;
};

export default function ChatPanel({
  conversationId,
}: {
  conversationId: number;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [streamingMessages, setStreamingMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: persistedMessages = [] } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

  const messages =
    streamingMessages.length > 0 ? streamingMessages : persistedMessages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text: string) {
    const userMsg: ChatMessage = { role: 'user', content: text };
    setStreamingMessages([...persistedMessages, userMsg]);
    setLoading(true);

    let aiContent = '';
    await sendMessage(
      conversationId,
      text,
      [...persistedMessages, userMsg],
      (chunk: string) => {
        aiContent += chunk;
        setStreamingMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, content: aiContent }];
          }
          return [...prev, { role: 'assistant', content: aiContent }];
        });
      },
    );

    setLoading(false);
    setStreamingMessages([]);
    await queryClient.invalidateQueries({
      queryKey: ['messages', conversationId],
    });
  }

  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m: ChatMessage, i: number) => (
          <Message key={i} message={m} />
        ))}
        {loading && (
          <div className="text-gray-400 text-sm">AI is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <InputForm onSend={handleSend} />
    </main>
  );
}
