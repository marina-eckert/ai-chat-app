const conversations = [
  { id: 1, title: 'Chat about Tailwind' },
  { id: 2, title: 'General questions' },
];

export async function GET() {
  return Response.json(conversations);
}

export async function POST() {
  const newConvo = {
    id: Date.now(),
    title: 'New Chat',
  };
  conversations.push(newConvo);
  return Response.json(newConvo);
}
