import env from '../../config/env.js';
import { generateWithOllama, expandQueryWithOllama } from './ollamaService.js';
import { generateWithGroq, expandQueryWithGroq } from './groqService.js';

const MODE = env.LLM_MODE;

export const generate = MODE === 'ollama' ? generateWithOllama : generateWithGroq;
export const expandQuery = MODE === 'ollama' ? expandQueryWithOllama : expandQueryWithGroq;
