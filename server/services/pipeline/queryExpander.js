import { expandQuery } from '../llm/llmRouter.js';

export async function expandUserQuery(sessionContext, userMessage) {
  const disease = sessionContext?.disease || '';
  const location = sessionContext?.location || '';

  const contextNote = location ? ` (patient location: ${location})` : '';
  const contextualQuery = disease
    ? `${userMessage}${contextNote} in context of ${disease}`
    : userMessage;

  try {
    const expanded = await expandQuery(disease, userMessage);
    return {
      expandedQuery: expanded.expandedQuery || contextualQuery,
      keywords: expanded.keywords || [disease, userMessage].filter(Boolean),
      intent: expanded.intent || 'research',
      disease,
    };
  } catch (err) {
    console.error('[QueryExpander] Error:', err.message);
    return {
      expandedQuery: contextualQuery,
      keywords: [disease, userMessage].filter(Boolean),
      intent: 'research',
      disease,
    };
  }
}
