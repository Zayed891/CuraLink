import axios from 'axios';
import env from '../../config/env.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateWithGroq(systemPrompt, userPrompt) {
  try {
    const res = await axios.post(
      GROQ_URL,
      {
        model: env.GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    return res.data.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.error('[Groq] Generation error:', err.response?.data || err.message);
    return 'I was unable to generate a response at this time. Please try again.';
  }
}

export async function expandQueryWithGroq(disease, userQuery) {
  const systemPrompt =
    'You are a medical query expansion expert. Return ONLY valid JSON, no markdown, no explanation.';
  const userPrompt = `Expand this medical research query:
Disease: ${disease}
Query: ${userQuery}

Return JSON:
{
  "expandedQuery": "combined search string for PubMed/OpenAlex",
  "keywords": ["kw1", "kw2"],
  "intent": "treatment|prevention|diagnosis|clinical_trial|research"
}`;

  try {
    const raw = await generateWithGroq(systemPrompt, userPrompt);
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return {
      expandedQuery: `${userQuery} ${disease}`,
      keywords: [disease, userQuery].filter(Boolean),
      intent: 'research',
    };
  }
}
