import { NextRequest } from 'next/server';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { chatModel } from '@/lib/ai/provider';
import { extractMessageText } from '@/lib/ai/adapters';
import { getConversation } from '@/lib/db/conversations';
import { appendMessage } from '@/lib/db/messages';

export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_KEY) {
    return new Response('OPENROUTER_KEY is not configured', { status: 500 });
  }

  const { messages, conversationId } = (await req.json()) as {
    messages: UIMessage[];
    conversationId: number;
  };

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return new Response(`Conversation ${conversationId} not found`, {
      status: 404,
    });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (lastUser) {
    await appendMessage({
      conversationId,
      role: 'user',
      content: extractMessageText(lastUser),
    });
  }

  const result = streamText({
    model: chatModel,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      await appendMessage({
        conversationId,
        role: 'assistant',
        content: extractMessageText(responseMessage),
      });
    },
  });
}
