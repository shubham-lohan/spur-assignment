import { LLMProvider, LLMProviderType } from './llm.provider';
import { OpenAIProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { config } from '../../config';

export class LLMFactory {
    private static instance: LLMProvider;

    static getProvider(): LLMProvider {
        if (this.instance) {
            return this.instance;
        }

        const providerType = (config.llm.provider as LLMProviderType) || LLMProviderType.OPENAI;
        console.log(`Initializing LLM Factory with ${providerType} provider`);

        switch (providerType) {
            case LLMProviderType.GEMINI:
                this.instance = new GeminiProvider();
                break;
            case LLMProviderType.OPENAI:
            default:
                this.instance = new OpenAIProvider();
                break;
        }

        return this.instance;
    }
}
