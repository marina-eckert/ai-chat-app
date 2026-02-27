const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(text) {
  const msg = document.createElement('div');
  msg.classList.add('message', 'user-message');
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
  if (e.key === 'Enter') sendBtn.click();
});
