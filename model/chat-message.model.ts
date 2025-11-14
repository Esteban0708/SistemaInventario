// Tipos del chat (un solo archivo, sin duplicados)

export type ChatRole = 'user' | 'assistant'; // agrega 'system' si realmente lo usarás

export interface ChatTurn {
  role: ChatRole;     // o: role: 'user' | 'assistant' | 'system';
  content: string;
  ts?: number;        // opcional: timestamp
}

export type BotResponse =
  | { type: 'text'; text: string }
  | { type: 'navigate'; route: string; text: string }
  | { type: 'error'; text: string };   // ← importante

// Si vas a usar ChatReply para respuestas de un backend, alinéalo con BotResponse.
// Si no lo usas, elimínalo para evitar ruido.
export interface ChatReply {
  reply: string;
  error?: string;
}
