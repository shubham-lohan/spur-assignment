export interface Message {
  id?: string;
  text: string;
  sender: 'user' | 'ai';
  createdAt?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}
