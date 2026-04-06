import { NextRequest } from 'next/server';

const messagesDB: Record<
  number,
  { id: number; role: string; content: string }[]
> = {
  1: [
    { id: 1, role: 'assistant', content: 'Hey! Ask me about Tailwind.' },
    { id: 2, role: 'user', content: 'How do I use flex?' },
  ],
  2: [{ id: 1, role: 'assistant', content: 'Ask me anything!' }],
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const conversationId = Number(id);
  return Response.json(messagesDB[conversationId] || []);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const conversationId = Number(id);
  const body = await req.json();

  if (!messagesDB[conversationId]) messagesDB[conversationId] = [];

  const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
  const KEY = process.env.OPENROUTER_KEY;

  const userMsg = { id: Date.now(), role: 'user', content: body.content };
  messagesDB[conversationId].push(userMsg);

  const aiRes = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: body.history,
      stream: true,
    }),
  });

  const stream = new ReadableStream({
    async start(controller) {
      const reader = aiRes.body!.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n');
        buffer = parts.pop()!;

        for (let part of parts) {
          part = part.trim();
          if (!part.startsWith('data:')) continue;
          const payload = part.slice(5).trim();
          if (payload === '[DONE]') {
            messagesDB[conversationId].push({
              id: Date.now(),
              role: 'assistant',
              content: aiContent,
            });
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(payload);
            const token = json?.choices?.[0]?.delta?.content;
            if (token) {
              aiContent += token;
              controller.enqueue(new TextEncoder().encode(token));
            }
          } catch {
            /* skip */
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
