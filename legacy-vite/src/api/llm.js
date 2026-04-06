const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

const KEY = import.meta.env.VITE_OPENROUTER_KEY;

export async function getAIResponse(messages, onChunk) {
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
      if (!part.startsWith('data:')) continue;

      const payload = part.slice(5).trim();
      if (payload === '[DONE]') return result;

      try {
        const json = JSON.parse(payload);
        const token = json?.choices?.[0]?.delta?.content;

        if (token) {
          result += token;
          onChunk?.(token);
        }
      } catch {
        /* empty */
      }
    }
  }

  return result;
}
