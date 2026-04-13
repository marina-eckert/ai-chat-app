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

  const KEY = process.env.OPENROUTER_KEY;
  if (!KEY) {
    return new Response('OPENROUTER_KEY is not configured', { status: 500 });
  }

  if (!messagesDB[conversationId]) messagesDB[conversationId] = [];

  const userMsg = { id: Date.now(), role: 'user', content: body.content };
  messagesDB[conversationId].push(userMsg);

  let aiRes: Response;
  try {
    aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
  } catch {
    return new Response('Failed to contact AI service', { status: 500 });
  }

  if (!aiRes.ok) {
    const errText = await aiRes.text();
    return new Response(`OpenRouter error: ${errText}`, { status: 502 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = aiRes.body!.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';
      let buffer = '';

      try {
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
              /* skip malformed chunk */
            }
          }
        }
      } catch {
        controller.error(new Error('Stream read failed'));
        return;
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
