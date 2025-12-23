# Spur AI Chatbot - Full Stack Application

A customer support AI chatbot application built with React, Node.js, Express, and PostgreSQL (via Prisma). Supports OpenAI and Google Gemini LLM providers.

## Local Development

1.  **Install dependencies:**
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```

2.  **Setup Environment:**
    *   Create a `.env` file in the `server` directory. You can copy the example:
    ```bash
    cp server/.env.example server/.env
    ```
    *   **Required Environment Variables (Server):**

    | Variable | Description | Default/Example |
    | :--- | :--- | :--- |
    | `PORT` | Server port | `3001` |
    | `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
    | `LLM_PROVIDER` | AI Provider (`openai` or `gemini`) | `openai` |
    | `OPENAI_API_KEY` | OpenAI API Key (required if provider is openai) | `sk-...` |
    | `LLM_MODEL` | OpenAI Model | `gpt-3.5-turbo` |
    | `GEMINI_API_KEY` | Google Gemini API Key (required if provider is gemini) | `AIza...` |
    | `GEMINI_MODEL` | Gemini Model | `gemini-2.5-flash-lite` |

3.  **Run:**
    *   Start Server: `cd server && npm run dev`
    *   Start Client: `cd client && npm run dev`
