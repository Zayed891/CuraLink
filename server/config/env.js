import dotenv from 'dotenv';
dotenv.config();

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  LLM_MODE: process.env.LLM_MODE || 'groq',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2',
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
  PUBMED_API_KEY: process.env.PUBMED_API_KEY,
  OPENALEX_EMAIL: process.env.OPENALEX_EMAIL,
  JWT_SECRET: process.env.JWT_SECRET || 'curalink-super-secret-dev-key-1234',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Validate critical env vars
const required = ['MONGODB_URI', 'GROQ_API_KEY'];
for (const key of required) {
  if (!env[key]) {
    console.error(`[ENV] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export default env;
