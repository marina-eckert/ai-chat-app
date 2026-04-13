export async function getMessages(conversationId: number) {
  const res = await fetch(`/api/messages/${conversationId}`);
  return res.json();
}

export async function sendMessage(
  conversationId: number,
  content: string,
  history: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
) {
  const res = await fetch(`/api/messages/${conversationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, history }),
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}
