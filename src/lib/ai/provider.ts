import 'server-only';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_KEY ?? '',
});

export const chatModel = openrouter('openai/gpt-4o-mini');
