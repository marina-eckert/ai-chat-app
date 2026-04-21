export type DbRole = 'user' | 'assistant' | 'system';

export type ConversationDTO = {
  id: number;
  title: string;
  createdAt: string;
};

export type MessageDTO = {
  id: number;
  role: DbRole;
  content: string;
  createdAt: string;
};
