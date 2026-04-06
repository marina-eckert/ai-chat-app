let messagesDB = {
  1: [
    { id: 1, role: 'assistant', content: 'Hey! Ask me about Tailwind.' },
    { id: 2, role: 'user', content: 'How do I use flex?' },
  ],
  2: [{ id: 1, role: 'assistant', content: 'Ask me anything!' }],
};

export function getMessages(conversationId) {
  return Promise.resolve(messagesDB[conversationId] || []);
}

export function addMessage(conversationId, message) {
  if (!messagesDB[conversationId]) {
    messagesDB[conversationId] = [];
  }

  messagesDB[conversationId].push({
    id: Date.now(),
    ...message,
  });

  return Promise.resolve();
}
