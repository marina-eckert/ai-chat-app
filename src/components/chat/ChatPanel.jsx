import { useEffect, useState, useRef } from 'react';
import { getMessages, addMessage } from '../../api/messages';
import { getAIResponse } from '../../api/llm';
import Message from './Message';
import InputForm from './InputForm';

export default function ChatPanel({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    getMessages(conversationId).then(setMessages);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text) {
    const userMsg = { role: 'user', content: text };

    await addMessage(conversationId, userMsg);
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    let aiContent = '';

    await getAIResponse([...messages, userMsg], (chunk) => {
      aiContent += chunk;

      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (last?.role === 'assistant') {
          return [...prev.slice(0, -1), { ...last, content: aiContent }];
        }

        return [...prev, { role: 'assistant', content: aiContent }];
      });
    });

    setLoading(false);
  }

  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m, i) => (
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
