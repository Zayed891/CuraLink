import axios from 'axios';

const BASE_URL = 'https://clinicaltrials.gov/api/v2/studies';

export async function fetchClinicalTrials(query, disease, maxResults = 100) {
  try {
    const searchQuery = `${query} ${disease}`.trim();

    const res = await axios.get(BASE_URL, {
      params: {
        'query.term': searchQuery,
        pageSize: maxResults,
        format: 'json',
        fields: [
          'NCTId',
          'BriefTitle',
          'OverallStatus',
          'EligibilityCriteria',
          'LocationFacility',
          'LocationCity',
          'LocationCountry',
          'CentralContactName',
          'CentralContactPhone',
          'CentralContactEMail',
          'BriefSummary',
          'StartDate',
          'CompletionDate',
          'Phase',
        ].join(','),
      },
      timeout: 15000,
    });

    const studies = res.data?.studies || [];
    return studies.map(normalizeTrial);
  } catch (err) {
    console.error('[ClinicalTrials] Fetch error:', err.message);
    return [];
  }
}

function normalizeTrial(study) {
  const proto = study.protocolSection || {};
  const id = proto.identificationModule;
  const status = proto.statusModule;
  const eligibility = proto.eligibilityModule;
  const contacts = proto.contactsLocationsModule;
  const desc = proto.descriptionModule;

  const location = contacts?.locations?.[0];
  const contact = contacts?.centralContacts?.[0];

  return {
    nctId: id?.nctId,
    title: id?.briefTitle || 'Untitled Trial',
    status: status?.overallStatus || 'Unknown',
    phase: proto.designModule?.phases?.join(', ') || 'N/A',
    summary: desc?.briefSummary || 'No summary available.',
    eligibility: eligibility?.eligibilityCriteria || 'Not specified.',
    location: location
      ? `${location.facility || ''}, ${location.city || ''}, ${location.country || ''}`
      : 'Location not listed',
    contact: contact
      ? `${contact.name || ''} | ${contact.phone || ''} | ${contact.email || ''}`
      : 'Contact not available',
    url: `https://clinicaltrials.gov/study/${id?.nctId}`,
    startDate: status?.startDateStruct?.date,
    completionDate: status?.completionDateStruct?.date,
  };
}
