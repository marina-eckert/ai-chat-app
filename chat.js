// Custom element for chat messages
class ChatMessage extends HTMLElement {
  connectedCallback() {
    const type = this.getAttribute('type');
    const isUser = type === 'user';
    const text = this.textContent.trim();

    this.textContent = '';

    this.className = ['flex', isUser ? 'justify-end' : 'justify-start'].join(
      ' ',
    );

    const bubble = document.createElement('div');
    bubble.innerHTML = text;
    bubble.className = [
      'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed',
      isUser
        ? 'bg-indigo-600 text-white rounded-br-sm'
        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm',
    ].join(' ');

    this.appendChild(bubble);
  }
}

customElements.define('chat-message', ChatMessage);

// Send button functionality
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(text) {
  const msg = document.createElement('chat-message');
  msg.setAttribute('type', 'user');
  msg.textContent = text;
  messageList.appendChild(msg);
  messageList.scrollTop = messageList.scrollHeight;
}

sendBtn.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (!text) return;
  addMessage(text);
  messageInput.value = '';
});

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});
