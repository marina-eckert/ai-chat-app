import {
  appendUserMessage,
  createAssistantBubble,
  scrollToBottom,
} from './chat.js';
import { streamCompletion } from './api.js';

const input = document.getElementById('messageInput');
const sendButton = document.getElementById('sendBtn');

const history = [];

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  sendButton.disabled = true;

  appendUserMessage(text);
  history.push({ role: 'user', content: text });

  const assistantBubble = createAssistantBubble();

  try {
    const reply = await streamCompletion(history, (chunk) => {
      assistantBubble.textContent += chunk;
      scrollToBottom();
    });

    history.push({
      role: 'assistant',
      content: reply,
    });
  } catch (err) {
    console.error(err);
    assistantBubble.textContent = 'Something went wrong.';
  }

  sendButton.disabled = false;
  input.focus();
}

sendButton.addEventListener('click', sendMessage);

input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  if (e.shiftKey) return;

  e.preventDefault();
  sendMessage();
});
