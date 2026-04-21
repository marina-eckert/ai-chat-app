import type { UIMessage } from 'ai';
import Sidebar from './sidebar/Sidebar';
import ChatPanel from './chat/ChatPanel';

export default function ConversationLayout({
  conversationId,
  initialMessages,
}: {
  conversationId: number;
  initialMessages: UIMessage[];
}) {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar activeId={conversationId} />
      <ChatPanel
        conversationId={conversationId}
        initialMessages={initialMessages}
      />
    </div>
  );
}
