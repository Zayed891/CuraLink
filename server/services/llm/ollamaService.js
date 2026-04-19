import axios from 'axios';
import env from '../../config/env.js';

const OLLAMA_URL = env.OLLAMA_BASE_URL;
const MODEL = env.OLLAMA_MODEL;

export async function generateWithOllama(systemPrompt, userPrompt) {
  try {
    const res = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 2048,
      },
    });
    return res.data.message?.content || '';
  } catch (err) {
    console.error('[Ollama] Generation error:', err.message);
    return 'I was unable to generate a response at this time. Please try again.';
  }
}

export async function expandQueryWithOllama(disease, userQuery) {
  const prompt = `You are a medical research assistant. Expand the following query for searching medical databases.

Disease: ${disease}
User Query: ${userQuery}

Return ONLY a JSON object with this structure:
{
  "expandedQuery": "the combined search query string",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "intent": "treatment|prevention|diagnosis|clinical_trial|research"
}

Do not include any explanation. Return only valid JSON.`;

  try {
    const raw = await generateWithOllama(
      'You are a medical query expansion expert. Return only JSON.',
      prompt
    );
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      expandedQuery: `${userQuery} ${disease}`,
      keywords: [disease, userQuery].filter(Boolean),
      intent: 'research',
    };
  }
}
