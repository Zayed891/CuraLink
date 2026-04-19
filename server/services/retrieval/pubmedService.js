import axios from 'axios';
import env from '../../config/env.js';

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

export async function fetchPubMedPublications(query, maxResults = 150) {
  try {
    // Step 1: Search for IDs
    const searchRes = await axios.get(`${BASE_URL}/esearch.fcgi`, {
      params: {
        db: 'pubmed',
        term: query,
        retmax: maxResults,
        sort: 'relevance',
        retmode: 'json',
        api_key: env.PUBMED_API_KEY,
      },
      timeout: 15000,
    });

    const ids = searchRes.data.esearchresult?.idlist || [];
    if (!ids.length) return [];

    // Step 2: Fetch details (max 100 per efetch request)
    const fetchRes = await axios.get(`${BASE_URL}/efetch.fcgi`, {
      params: {
        db: 'pubmed',
        id: ids.slice(0, 100).join(','),
        retmode: 'xml',
        api_key: env.PUBMED_API_KEY,
      },
      timeout: 20000,
    });

    // Step 3: Parse XML
    return parsePubMedXML(fetchRes.data);
  } catch (err) {
    console.error('[PubMed] Fetch error:', err.message);
    return [];
  }
}

function parsePubMedXML(xml) {
  const results = [];
  const articleRegex = /<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g;
  let match;

  while ((match = articleRegex.exec(xml)) !== null) {
    const article = match[1];

    const title = extractTag(article, 'ArticleTitle');
    const abstract = extractTag(article, 'AbstractText');
    const pmid = extractTag(article, 'PMID');
    const year =
      extractTag(article, 'Year') ||
      extractTag(article, 'MedlineDate')?.slice(0, 4);
    const authorMatches = [...article.matchAll(/<LastName>(.*?)<\/LastName>/g)];
    const authors = authorMatches.map((a) => a[1]).slice(0, 5);

    if (title) {
      results.push({
        title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        abstract: abstract
          ? abstract.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, ' ').trim()
          : 'No abstract available.',
        authors,
        year: parseInt(year) || null,
        source: 'PubMed',
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        citationCount: null,
      });
    }
  }

  return results;
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 's'));
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : null;
}
