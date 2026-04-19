/**
 * Multi-factor ranking for publications:
 * - Keyword overlap with query (relevance)  0–40
 * - Recency (year)                          0–30
 * - Citation count (OpenAlex)              0–20
 * - Source credibility weight              0–10
 * - Abstract quality penalty              -10
 */
export function rankPublications(publications, keywords, topN = 8) {
  const currentYear = new Date().getFullYear();

  // Reset deduplication set for each ranking call
  const seen = new Set();

  const scored = publications.map((pub) => {
    const text = `${pub.title} ${pub.abstract}`.toLowerCase();

    // Keyword relevance score (0–40)
    const keywordScore = keywords.reduce((acc, kw) => {
      const count = (text.match(new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      return acc + Math.min(count * 5, 15);
    }, 0);

    // Recency score (0–30): full points for current year, -3 per year older
    const yearDiff = currentYear - (pub.year || 2010);
    const recencyScore = Math.max(0, 30 - yearDiff * 3);

    // Citation score (0–20): log scale. PubMed gets baseline 5
    const citationScore = pub.citationCount != null
      ? Math.min(20, Math.log10(pub.citationCount + 1) * 7)
      : 5;

    // Source credibility (0–10)
    const sourceScore = pub.source === 'PubMed' ? 10 : 7;

    // Abstract quality — penalize missing abstracts
    const abstractPenalty = pub.abstract === 'No abstract available.' ? -10 : 0;

    const totalScore =
      keywordScore + recencyScore + citationScore + sourceScore + abstractPenalty;

    return { ...pub, _score: totalScore };
  });

  return scored
    .sort((a, b) => b._score - a._score)
    .filter((pub) => {
      const normalized = pub.title?.toLowerCase().replace(/\W/g, '').slice(0, 60);
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .slice(0, topN)
    .map(({ _score, ...pub }) => pub);
}

export function rankClinicalTrials(trials, keywords, topN = 6) {
  const statusWeight = {
    RECRUITING: 30,
    'ACTIVE, NOT RECRUITING': 20,
    ENROLLING_BY_INVITATION: 15,
    COMPLETED: 10,
    TERMINATED: 2,
    WITHDRAWN: 0,
  };

  const scored = trials.map((trial) => {
    const text = `${trial.title} ${trial.summary}`.toLowerCase();
    const keywordScore = keywords.reduce((acc, kw) => {
      return acc + (text.includes(kw.toLowerCase()) ? 15 : 0);
    }, 0);
    const statusScore = statusWeight[trial.status?.toUpperCase()] ?? 5;

    return { ...trial, _score: keywordScore + statusScore };
  });

  return scored
    .sort((a, b) => b._score - a._score)
    .slice(0, topN)
    .map(({ _score, ...trial }) => trial);
}
