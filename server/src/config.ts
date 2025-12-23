import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  llm: {
    provider: process.env.LLM_PROVIDER || 'openai',
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
    },
  },
};
