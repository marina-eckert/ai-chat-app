let conversations = [
  { id: 1, title: 'Chat about Tailwind' },
  { id: 2, title: 'General questions' },
];

export function getConversations() {
  return Promise.resolve(conversations);
}
