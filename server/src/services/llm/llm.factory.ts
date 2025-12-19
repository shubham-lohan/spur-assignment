import { LLMProvider } from './llm.provider';
import { OpenAIProvider } from './openai.provider';

export class LLMFactory {
    private static instance: LLMProvider;

    static getProvider(): LLMProvider {
        if (this.instance) {
            return this.instance;
        }

        console.log(`Initializing LLM Factory with OpenAI provider`);

        this.instance = new OpenAIProvider();

        return this.instance;
    }
}
