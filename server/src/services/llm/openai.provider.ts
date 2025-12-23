import OpenAI from 'openai';
import { Message, Sender } from '@prisma/client';
import { LLMProvider } from './llm.provider';
import { config } from '../../config';

export class OpenAIProvider implements LLMProvider {
  private openai: OpenAI;
  private model: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.llm.openai.apiKey || 'dummy-key',
    });
    
    this.model = config.llm.openai.model;
    console.log(`OpenAIProvider initialized with model ${this.model}`);
  }

  async generateResponse(history: Message[], newMessage: string, systemPrompt: string): Promise<string> {
    try {
      const conversationHistory = history.map((msg) => ({
        role: msg.sender === Sender.USER ? 'user' : 'assistant',
        content: msg.text,
      } as const));

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: newMessage },
        ],
        max_tokens: 150,
      });

      return response.choices[0]?.message?.content || "I'm not sure how to respond to that.";
    } catch (error) {
      console.error('OpenAI Provider Error:', error);
      return "I'm having trouble connecting to the support server. Please try again later.";
    }
  }
}
