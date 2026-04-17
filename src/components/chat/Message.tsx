import type { UIMessage } from 'ai';
import { extractMessageText } from '@/lib/ai/adapters';

export default function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user';
  const text = extractMessageText(message);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-2xl text-sm max-w-md whitespace-pre-wrap ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 shadow'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
