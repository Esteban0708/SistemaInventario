export interface ChatTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
export type BotResponse =
  | { type: 'text'; text: string }
  | { type: 'navigate'; route: string; text: string };

export interface ChatReply {
  reply: string;
  error?: string;
}
