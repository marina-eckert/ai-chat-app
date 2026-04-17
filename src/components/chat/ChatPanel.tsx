'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import Message from './Message';
import InputForm from './InputForm';

export default function ChatPanel({
  conversationId,
  initialMessages,
}: {
  conversationId: number;
  initialMessages: UIMessage[];
}) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: `conversation-${conversationId}`,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { conversationId },
    }),
    onFinish: () => {
      router.refresh();
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isStreaming = status === 'submitted' || status === 'streaming';

  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        {isStreaming && (
          <div className="text-gray-400 text-sm">AI is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <InputForm
        onSend={(text) => sendMessage({ text })}
        disabled={isStreaming}
      />
    </main>
  );
}
