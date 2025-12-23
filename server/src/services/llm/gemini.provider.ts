import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { Message, Sender } from '@prisma/client';
import { LLMProvider } from './llm.provider';
import { config } from '../../config';

export class GeminiProvider implements LLMProvider {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor() {
    const apiKey = config.llm.gemini.apiKey;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. GeminiProvider will fail if used.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
    
    this.model = config.llm.gemini.model;
    console.log(`GeminiProvider initialized with model ${this.model}`);
  }

  async generateResponse(history: Message[], newMessage: string, systemPrompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.model,
        systemInstruction: systemPrompt,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      });

      const conversationHistory: Content[] = history.map((msg) => ({
        role: msg.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({
        history: conversationHistory,
      });

      const result = await chat.sendMessage(newMessage);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Provider Error:', error);
      return "I'm having trouble connecting to the support server (Gemini). Please try again later.";
    }
  }
}
