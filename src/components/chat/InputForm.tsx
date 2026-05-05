'use client';
import { useState } from 'react';

export default function InputForm({
  onSend,
  disabled = false,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 p-4 flex gap-2"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Message..."
        className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        disabled={disabled}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
