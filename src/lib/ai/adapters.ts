import type { UIMessage } from 'ai';
import type { MessageDTO } from '@/lib/db/types';

export function dbToUIMessage(msg: MessageDTO): UIMessage {
  return {
    id: String(msg.id),
    role: msg.role === 'system' ? 'system' : msg.role,
    parts: [{ type: 'text', text: msg.content }],
  };
}

export function extractMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}
