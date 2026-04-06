export async function getConversations() {
  const res = await fetch('/api/conversations');
  return res.json();
}
