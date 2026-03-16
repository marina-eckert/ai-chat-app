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

const messageList = document.getElementById('messageList');

export function appendUserMessage(text) {
  const msg = document.createElement('chat-message');
  msg.setAttribute('type', 'user');
  msg.textContent = text;
  messageList.appendChild(msg);
  messageList.scrollTop = messageList.scrollHeight;
}

export function createAssistantBubble() {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex justify-start';

  const bubble = document.createElement('div');
  bubble.className =
    'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed bg-white text-gray-800 shadow-sm rounded-bl-sm';

  wrapper.appendChild(bubble);
  messageList.appendChild(wrapper);
  return bubble;
}

export function scrollToBottom() {
  messageList.scrollTop = messageList.scrollHeight;
}
