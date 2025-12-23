export enum Sender {
  User = 'user',
  AI = 'ai',
}

export interface Message {
  id?: string;
  text: string;
  sender: Sender;
  createdAt?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}
