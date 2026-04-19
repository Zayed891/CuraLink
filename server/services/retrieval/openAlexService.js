import axios from 'axios';
import env from '../../config/env.js';

const BASE_URL = 'https://api.openalex.org/works';

export async function fetchOpenAlexPublications(query, maxResults = 150) {
  try {
    const allResults = [];
    const perPage = 50;
    const pages = Math.ceil(maxResults / perPage);

    for (let page = 1; page <= pages; page++) {
      const res = await axios.get(BASE_URL, {
        params: {
          search: query,
          'per-page': perPage,
          page,
          sort: 'relevance_score:desc',
          mailto: env.OPENALEX_EMAIL,
          filter: 'has_abstract:true',
        },
        timeout: 15000,
      });

      const works = res.data?.results || [];
      if (!works.length) break;

      allResults.push(...works.map(normalizeOpenAlexWork));
    }

    return allResults;
  } catch (err) {
    console.error('[OpenAlex] Fetch error:', err.message);
    return [];
  }
}

function normalizeOpenAlexWork(work) {
  return {
    title: work.title || 'Untitled',
    abstract:
      reconstructAbstract(work.abstract_inverted_index) ||
      'No abstract available.',
    authors: (work.authorships || [])
      .slice(0, 5)
      .map((a) => a.author?.display_name)
      .filter(Boolean),
    year: work.publication_year,
    source: 'OpenAlex',
    url:
      work.primary_location?.landing_page_url || work.doi || '#',
    citationCount: work.cited_by_count || 0,
    openAccess: work.open_access?.is_oa || false,
  };
}

// OpenAlex stores abstracts as inverted index — reconstruct the text
function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return null;
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.filter(Boolean).join(' ');
}
