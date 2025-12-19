import { Message } from '@prisma/client';

export interface LLMProvider {
  generateResponse(history: Message[], newMessage: string, systemPrompt: string): Promise<string>;
}
