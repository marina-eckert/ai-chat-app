import { useEffect, useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ChatPanel from './components/chat/ChatPanel';
import { getConversations } from './api/conversations';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    getConversations().then((data) => {
      setConversations(data);
      if (data.length > 0) {
        setActiveId(data[0].id);
      }
    });
  }, []);

  return (
    <div className="h-screen flex bg-gray-100 text-gray-800 overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
      />

      {activeId && <ChatPanel conversationId={activeId} />}
    </div>
  );
}
