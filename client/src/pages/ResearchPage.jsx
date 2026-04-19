import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import useChatStore from '../store/chatStore';
import ChatThread from '../components/chat/ChatThread';
import ChatInput from '../components/chat/ChatInput';

const SUGGESTIONS = [
  { title: 'Latest treatment options', sub: 'Evidence-based first & second line therapies' },
  { title: 'Clinical trials near me', sub: 'Recruiting studies matching this condition' },
  { title: 'Recent research breakthroughs', sub: 'High-impact publications from the last 12 months' },
  { title: 'Common side effects & interactions', sub: 'Drug safety and adverse event data' },
];

// ─────────────────────────────────────────────────────────────────────
// RESEARCH PAGE
//
// Each patient has their own chat session.
// Logic:
//   1. When activePatient changes → look up patientSessionMap[patient.id]
//   2. If a sessionId exists → call loadHistory(sessionId) to restore it
//   3. If no sessionId exists → show empty state (new chat for this patient)
//   4. When first message is sent → createSession() → bind result to patient
// ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const navigate = useNavigate();
  const [synthOpen, setSynthOpen] = useState(false);

  const {
    activePatient,
    patients,
    patientSessionMap,
    bindSessionToPatient,
    setAddPatientModalOpen,
  } = useAppStore();

  const {
    messages,
    isLoading,
    sendMessage,
    activeSessionId,
    createSession,
    loadHistory,
    setActiveSession,
  } = useChatStore();

  // The patient we're currently researching for
  const patient = activePatient || (patients.length > 0 ? patients[0] : null);

  // ── When patient changes, switch to their session ──────────────────
  useEffect(() => {
    if (!patient) return;

    const savedSessionId = patientSessionMap[patient.id];

    if (savedSessionId && savedSessionId !== activeSessionId) {
      // Patient already has a session → restore it
      loadHistory(savedSessionId);
    } else if (!savedSessionId) {
      // No session yet for this patient → clear the chat so a fresh empty
      // state is shown without loading another patient's messages.
      // We do NOT create a session here — only create when first message sent.
      useChatStore.setState({ messages: [], activeSessionId: null });
    }
    // If savedSessionId === activeSessionId → already loaded, nothing to do
  }, [patient?.id]); // eslint-disable-line

  // ── Get or create a session for the current patient ────────────────
  const ensureSession = async () => {
    if (!patient) return null;

    // Already have a session for this patient
    const existing = patientSessionMap[patient.id];
    if (existing) {
      if (activeSessionId !== existing) {
        await loadHistory(existing);
      }
      return existing;
    }

    // Create a brand-new session for this patient
    const sessionId = await createSession({
      name: patient.name,
      disease: patient.primaryCondition,
      location: patient.location,
      additionalContext: patient.notes,
    });

    // Bind the new sessionId to this patient so subsequent visits restore it
    bindSessionToPatient(patient.id, sessionId);
    return sessionId;
  };

  const handleSuggestion = async (text) => {
    await ensureSession();
    sendMessage(text);
  };

  const handleSendMessage = async (content) => {
    await ensureSession();
    sendMessage(content);
  };

  const hasMessages = messages && messages.length > 0;

  return (
    <>
      <style>{`
        .workspace-layout { display: flex; flex: 1; overflow: hidden; height: 100%; position: relative; }
        .chat-area { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .synth-panel-wrapper {
          width: 340px; min-width: 340px; flex-shrink: 0;
          background: var(--surface); border-left: 1px solid var(--border);
          overflow-y: auto; display: flex; flex-direction: column;
          transition: transform var(--transition);
        }
        .synth-overlay { display: none; position: absolute; inset: 0; background: rgba(0,0,0,0.2); z-index: 35; animation: fadeIn 0.2s ease; }
        .synth-mobile-toggle { display: none; }
        
        @media (max-width: 1024px) {
          .synth-panel-wrapper {
            position: absolute; top: 0; right: 0; bottom: 0;
            transform: translateX(100%);
            z-index: 40; box-shadow: var(--shadow-lg);
          }
          .synth-panel-wrapper.open { transform: translateX(0); }
          .synth-overlay.open { display: block; }
          .synth-mobile-toggle { display: flex; align-items: center; justify-content: center; gap: 6px; background: var(--bg-alt); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 6px 12px; cursor: pointer; color: var(--accent); position: absolute; right: 16px; top: 8px; z-index: 30; font-family: Inter; font-size: 13px; font-weight: 500; }
          .compliance-badge { display: none !important; }
          .suggestion-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="workspace-layout">
        <div className={`synth-overlay ${synthOpen ? 'open' : ''}`} onClick={() => setSynthOpen(false)} />
        
        {/* CHAT AREA */}
        <div className="chat-area">

        {/* Header bar with session chip */}
        <div style={{
          height: 48, borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px', background: 'var(--bg)', flexShrink: 0,
          position: 'relative',
        }}>
          {/* Centered session chip */}
          {patient && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid var(--border)', borderRadius: 'var(--radius-full)',
              padding: '4px 14px', background: 'var(--surface)',
            }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Session: {patient.primaryCondition || patient.name || 'Research Mode'}
              </span>
            </div>
          )}
          {/* Compliance badge — right absolute */}
          <div className="compliance-badge" style={{ position: 'absolute', right: 20, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>HIPAA COMPLIANT</span>
          </div>
          
          <button className="synth-mobile-toggle" onClick={() => setSynthOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Insights
          </button>
        </div>

        {/* Chat thread / empty state */}
        {!hasMessages && !isLoading ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 24px', overflowY: 'auto',
          }}>
            {/* Logo mark */}
            <img src="/logo.png" alt="CuraLink Logo" style={{ width: 64, height: 64, borderRadius: '16px', objectFit: 'contain', marginBottom: 20, boxShadow: '0 4px 14px rgba(11,138,116,0.15)', background: '#fff' }} />

            <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 32, color: 'var(--text-primary)', marginBottom: 8, textAlign: 'center' }}>
              {patient ? `Research for ${patient.name}` : 'Hello, Doctor'}
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 12 }}>
              {patient
                ? `New session · ${patient.primaryCondition || 'General research'}${patient.location ? ` · ${patient.location}` : ''}`
                : 'Select a patient from the sidebar to begin'}
            </p>

            {/* Context pills */}
            {patient && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
                {patient.primaryCondition && (
                  <span style={{ background: 'var(--accent-light)', border: '1px solid rgba(11,138,116,0.2)', borderRadius: 'var(--radius-full)', padding: '5px 14px', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--accent)' }}>
                    {patient.primaryCondition}
                  </span>
                )}
                {patient.location && (
                  <span style={{ background: 'var(--accent-light)', border: '1px solid rgba(11,138,116,0.2)', borderRadius: 'var(--radius-full)', padding: '5px 14px', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--accent)' }}>
                    📍 {patient.location}
                  </span>
                )}
                {patient.dob && (
                  <span style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '5px 14px', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)' }}>
                    DOB: {patient.dob}
                  </span>
                )}
              </div>
            )}

            {/* Suggestion cards */}
            {patient && (
              <div className="suggestion-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 620, width: '100%' }}>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => handleSuggestion(`${s.title}${patient?.primaryCondition ? ` for ${patient.primaryCondition}` : ''}`)}
                    style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)', padding: '18px 20px',
                      cursor: 'pointer', textAlign: 'left',
                      animation: `fadeUp 0.4s ${i * 80}ms ease forwards`, opacity: 0,
                      transition: 'border-color var(--transition), box-shadow var(--transition), transform var(--transition)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)' }}>{s.sub}</div>
                  </button>
                ))}
              </div>
            )}

            {!patient && (
              <button
                onClick={() => setAddPatientModalOpen(true)}
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px 28px', fontFamily: 'Inter', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                + Add a patient to start
              </button>
            )}
          </div>
        ) : (
          <ChatThread messages={messages} isLoading={isLoading} />
        )}

        {/* Chat input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={
            patient?.primaryCondition
              ? `Ask about ${patient.primaryCondition} for ${patient.name}…`
              : 'Ask a medical research question…'
          }
        />
      </div>

      {/* Synthesis panel — always visible when patient selected (on desktop) */}
      <div className={`synth-panel-wrapper ${synthOpen ? 'open' : ''}`}>
        <SynthesisPanel messages={messages} patient={patient} />
      </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SYNTHESIS PANEL
// ─────────────────────────────────────────────────────────────────────

function SynthesisPanel({ messages, patient }) {
  const publications = [];
  const trials = [];
  messages.forEach(msg => {
    if (msg.role === 'assistant') {
      if (msg.publications) publications.push(...msg.publications);
      if (msg.clinicalTrials) trials.push(...msg.clinicalTrials);
    }
  });

  return (
    <>
      <div style={{ padding: '22px 22px 16px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 2 }}>
        <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 4 }}>Synthesis</div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)' }}>Contextual intelligence and references.</div>
      </div>

      <div style={{ padding: '0 0 40px', flex: 1 }}>
        {patient && (
          <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent)' }}>Condition Focus</span>
            </div>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 12 }}>
              {patient.primaryCondition || 'General Research'}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {patient.location && <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-secondary)' }}>{patient.location}</span>}
              {patient.primaryCondition && <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, background: 'var(--accent-light)', border: '1px solid rgba(11,138,116,0.2)', borderRadius: 6, padding: '4px 10px', color: 'var(--accent)' }}>{patient.primaryCondition.split(' ')[0]}</span>}
            </div>
          </div>
        )}

        {publications.length > 0 && (
          <div style={{ padding: '18px 22px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Key Literature ({publications.length})</span>
              <button style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Scroll to view</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {publications.map((pub, i) => <LitCard key={i} pub={pub} />)}
            </div>
          </div>
        )}

        {trials.length > 0 && (
          <div style={{ padding: '18px 22px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Trials</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {trials.map((trial, i) => <TrialSynthCard key={i} trial={trial} />)}
            </div>
          </div>
        )}

        {publications.length === 0 && trials.length === 0 && (
          <div style={{ padding: '32px 22px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
              Literature and trial references will appear here once a query is processed.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function LitCard({ pub }) {
  const isPubMed = pub.source?.toLowerCase() === 'pubmed';
  const isOpenAlex = pub.source?.toLowerCase() === 'openalex';
  const sourceBg = isPubMed ? '#F3F4F6' : isOpenAlex ? '#EFF6FF' : '#F3F4F6';
  const sourceColor = isPubMed ? '#374151' : isOpenAlex ? '#1D4ED8' : '#374151';
  return (
    <a href={pub.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', transition: 'border-color var(--transition), box-shadow var(--transition)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(11,138,116,0.3)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(11,138,116,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, background: sourceBg, color: sourceColor, border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.5px' }}>
            {pub.source?.toUpperCase() || 'SOURCE'}{pub.pmid ? `: ${pub.pmid}` : ''}
          </span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{pub.title}</div>
        <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
            {Array.isArray(pub.authors) ? pub.authors.slice(0,2).join(', ') + (pub.authors.length > 2 ? ' et al.' : '') : pub.authors}
          </span>
          {pub.journal && <><span style={{ opacity: 0.4 }}>·</span><span>{pub.journal}{pub.year ? ` (${pub.year})` : ''}</span></>}
        </div>
      </div>
    </a>
  );
}

function TrialSynthCard({ trial }) {
  const isRecruiting = trial.status?.toUpperCase().includes('RECRUITING');
  return (
    <a href={trial.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', transition: 'border-color var(--transition), box-shadow var(--transition)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(11,138,116,0.3)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Inter', fontSize: 10, fontWeight: 600, background: isRecruiting ? 'var(--accent-light)' : 'var(--bg-alt)', color: isRecruiting ? 'var(--accent)' : 'var(--text-muted)', border: `1px solid ${isRecruiting ? 'rgba(11,138,116,0.2)' : 'var(--border)'}`, borderRadius: 20, padding: '3px 9px' }}>
            {isRecruiting && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />}
            {trial.status || 'Unknown'}
          </span>
          {trial.nctId && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)' }}>{trial.nctId}</span>}
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{trial.title}</div>
        {(trial.phase || trial.sponsor) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {trial.phase && <div><div style={{ fontFamily: 'Inter', fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Phase</div><div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{trial.phase}</div></div>}
            {trial.sponsor && <div><div style={{ fontFamily: 'Inter', fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Sponsor</div><div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trial.sponsor}</div></div>}
          </div>
        )}
      </div>
    </a>
  );
}
