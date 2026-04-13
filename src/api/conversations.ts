export async function getConversations() {
  const res = await fetch('/api/conversations');
  return res.json();
}

export async function createConversation() {
  const res = await fetch('/api/conversations', { method: 'POST' });
  return res.json();
}

export async function deleteConversation(id: number) {
  await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
}
