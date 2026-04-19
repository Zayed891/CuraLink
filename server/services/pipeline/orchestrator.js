import crypto from 'crypto';
import { expandUserQuery } from './queryExpander.js';
import { fetchPubMedPublications } from '../retrieval/pubmedService.js';
import { fetchOpenAlexPublications } from '../retrieval/openAlexService.js';
import { fetchClinicalTrials } from '../retrieval/clinicalTrialsService.js';
import { rankPublications, rankClinicalTrials } from '../ranking/rankingService.js';
import { generate } from '../llm/llmRouter.js';
import ResearchCache from '../../models/ResearchCache.js';

export async function runResearchPipeline(sessionContext, userMessage, conversationHistory) {
  // Step 1: Expand query
  const { expandedQuery, keywords, intent, disease } = await expandUserQuery(
    sessionContext,
    userMessage
  );

  // Step 2: Check cache
  const cacheKey = crypto.createHash('md5').update(expandedQuery).digest('hex');
  let publications = [];
  let clinicalTrials = [];

  const cached = await ResearchCache.findOne({ cacheKey });
  if (cached) {
    console.log('[Orchestrator] Cache hit for:', expandedQuery.slice(0, 60));
    publications = cached.publications;
    clinicalTrials = cached.clinicalTrials;
  } else {
    // Step 3: Parallel retrieval — never sequential
    const [pubmedResults, openAlexResults, trialsResults] = await Promise.allSettled([
      fetchPubMedPublications(expandedQuery, 150),
      fetchOpenAlexPublications(expandedQuery, 150),
      fetchClinicalTrials(expandedQuery, disease, 100),
    ]);

    if (pubmedResults.status === 'rejected')
      console.error('[Orchestrator] PubMed failed:', pubmedResults.reason?.message);
    if (openAlexResults.status === 'rejected')
      console.error('[Orchestrator] OpenAlex failed:', openAlexResults.reason?.message);
    if (trialsResults.status === 'rejected')
      console.error('[Orchestrator] ClinicalTrials failed:', trialsResults.reason?.message);

    const rawPublications = [
      ...(pubmedResults.status === 'fulfilled' ? pubmedResults.value : []),
      ...(openAlexResults.status === 'fulfilled' ? openAlexResults.value : []),
    ];

    clinicalTrials = trialsResults.status === 'fulfilled' ? trialsResults.value : [];

    // Step 4: Rank
    publications = rankPublications(rawPublications, keywords, 8);
    clinicalTrials = rankClinicalTrials(clinicalTrials, keywords, 6);

    console.log(
      `[Orchestrator] Ranked ${publications.length} pubs, ${clinicalTrials.length} trials`
    );

    // Step 5: Cache results
    try {
      await ResearchCache.create({ cacheKey, publications, clinicalTrials });
    } catch (cacheErr) {
      // Duplicate key on race condition — ignore
      if (cacheErr.code !== 11000) console.error('[Cache] Write error:', cacheErr.message);
    }
  }

  // Step 6: Generate structured LLM response
  const llmResponse = await generateStructuredResponse({
    sessionContext,
    userMessage,
    expandedQuery,
    publications,
    clinicalTrials,
    conversationHistory,
    intent,
  });

  return {
    expandedQuery,
    keywords,
    intent,
    publications,
    clinicalTrials,
    response: llmResponse,
  };
}

async function generateStructuredResponse({
  sessionContext,
  userMessage,
  publications,
  clinicalTrials,
  conversationHistory,
  intent,
}) {
  const pubContext = publications
    .slice(0, 5)
    .map(
      (p, i) =>
        `[PUB${i + 1}] Title: ${p.title}\nYear: ${p.year || 'N/A'}\nSource: ${p.source}\nAbstract: ${p.abstract?.slice(0, 400)}...`
    )
    .join('\n\n');

  const trialContext = clinicalTrials
    .slice(0, 3)
    .map(
      (t, i) =>
        `[TRIAL${i + 1}] Title: ${t.title}\nStatus: ${t.status}\nLocation: ${t.location}\nSummary: ${t.summary?.slice(0, 300)}...`
    )
    .join('\n\n');

  const historyContext = (conversationHistory || [])
    .slice(-4)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  const systemPrompt = `You are Curalink, an expert AI medical research assistant. You provide structured, evidence-based answers using retrieved research publications and clinical trials.

RULES:
- Never hallucinate. Only cite from provided research.
- Always attribute claims to specific publications using [PUB1], [PUB2] etc.
- Use clear, professional medical language.
- If the user has a specific disease context, personalize your answer to that condition.
- Structure your response clearly with the required sections.`;

  const userPrompt = `Patient context: ${JSON.stringify(sessionContext)}
Conversation history:
${historyContext}

Current question: "${userMessage}"

Retrieved publications:
${pubContext || 'No publications retrieved.'}

Retrieved clinical trials:
${trialContext || 'No clinical trials retrieved.'}

Provide a structured response with these sections:
1. **Condition Overview** (brief, 2-3 sentences)
2. **Research Insights** (cite publications, use [PUB1] etc.)
3. **Clinical Trials** (if applicable, reference [TRIAL1] etc.)
4. **Personalized Recommendation** (based on patient context)
5. **Important Note** (remind this is research info, not medical advice)

Be specific, cite evidence, avoid generic statements.`;

  try {
    return await generate(systemPrompt, userPrompt);
  } catch (err) {
    console.error('[Orchestrator] LLM generation failed:', err.message);
    return `I was able to retrieve ${publications.length} publications and ${clinicalTrials.length} clinical trials for your query, but encountered an error generating the summary. Please review the sources directly.`;
  }
}
