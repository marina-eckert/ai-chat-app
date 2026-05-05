const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const KEY =
  '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';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export async function streamCompletion(messages, onChunk) {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      stream: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}) ${text}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let result = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n');
    buffer = parts.pop();

    for (let part of parts) {
      part = part.trim();
      if (!part || !part.startsWith('data:')) continue;

      const payload = part.slice(5).trim();
      if (payload === '[DONE]') return result;

      let json;
      try {
        json = JSON.parse(payload);
      } catch {
        continue;
      }

      const token = json?.choices?.[0]?.delta?.content;
      if (!token) continue;

      result += token;
      if (typeof onChunk === 'function') {
        onChunk(token);
      }
    }
  }

  return result;
}
