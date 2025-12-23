import { Message } from '@prisma/client';

export enum LLMProviderType {
  OPENAI = 'openai',
  GEMINI = 'gemini',
}

export interface LLMProvider {
  generateResponse(history: Message[], newMessage: string, systemPrompt: string): Promise<string>;
}
