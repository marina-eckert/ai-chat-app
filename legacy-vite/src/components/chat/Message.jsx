export default function Message({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-2xl text-sm max-w-md ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 shadow'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
