import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useChatStore from '../store/chatStore';
import useAppStore from '../store/appStore';

// ─────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'GLP-1 receptor agonists for T2D',
  "Early-onset Parkinson's treatment",
  'mRNA vaccines — long-term safety',
  'Immunotherapy in NSCLC',
];

const DATA_SOURCES = [
  {
    name: 'PubMed',
    color: '#C0392B',
    iconColor: '#C0392B',
    iconBg: '#FEE2E2',
    desc: 'Access over 35 million citations for biomedical literature from MEDLINE, life science journals, and online books.',
    tags: ['35M+ Citations', 'Abstracts'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    name: 'ClinicalTrials.gov',
    color: '#0B8A74',
    iconColor: '#0B8A74',
    iconBg: '#E6F4F1',
    desc: 'Database of privately and publicly funded clinical studies conducted around the world — all phases and conditions.',
    tags: ['450k+ Studies', 'Phases I–IV'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v7.31" /><path d="M14 9.3V1.99" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
      </svg>
    ),
  },
  {
    name: 'OpenAlex',
    color: '#2563EB',
    iconColor: '#2563EB',
    iconBg: '#DBEAFE',
    desc: 'An open and comprehensive catalog of the global research system — tracking publications, authors, and venues worldwide.',
    tags: ['250M+ Works', 'Global Network'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Ask a question', body: 'Type any clinical query — a condition, treatment, drug, or research area. No special syntax needed.' },
  { n: '02', title: 'We search & retrieve', body: 'Our system queries PubMed, OpenAlex, and ClinicalTrials.gov simultaneously, pulling the most relevant sources.' },
  { n: '03', title: 'AI synthesizes evidence', body: 'An LLM reads the retrieved literature and synthesizes a structured, fully cited answer in seconds.' },
];

const FEATURES = [
  { title: 'Zero hallucinations', body: 'Every claim is grounded in retrieved literature. If a source doesn\'t say it, the AI won\'t either.' },
  { title: 'Real-time database access', body: 'Queries run live against PubMed, OpenAlex, and ClinicalTrials.gov — never from a stale training set.' },
  { title: 'Inline citations', body: 'Every statement links back to its source with [PUB1]-style citations. One click to the original paper.' },
  { title: 'Open-source LLM', body: 'Powered by Groq-accelerated or local Ollama models. No proprietary API lock-in. Your data stays yours.' },
  { title: 'Patient-context search', body: 'Set patient condition and location to filter clinical trials near your patient and personalize results.' },
  { title: 'Research archive', body: 'Every session is saved automatically. Search, filter, and export your research history anytime.' },
];

const FAQS = [
  {
    q: 'Where does the clinical evidence come from?',
    a: 'We directly query live databases including PubMed, ClinicalTrials.gov, and OpenAlex. Your results are generated strictly from peer-reviewed literature and registered clinical trials retrieved in real-time.'
  },
  {
    q: 'How does Curalink prevent AI hallucinations?',
    a: 'We use a strict Retrieval-Augmented Generation (RAG) architecture. The LLM is forced to cite its sources using inline [PUB1] markers. If the retrieved literature does not contain the answer, the AI will explicitly state that the evidence is unavailable.'
  },
  {
    q: 'Is my patient data secure and private?',
    a: 'Absolutely. We do not expose PHI (Protected Health Information). Our LLM providers have zero-retention policies. Your private patient profiles are sequestered entirely to your localized database records.'
  },
  {
    q: 'Do I need to be good at "prompt engineering"?',
    a: 'No. Just type your clinical question normally. Our backend pipeline automatically expands your query, identifies the optimal database parameters, and structures the final response into readable clinical insights.'
  },
  {
    q: 'Are my research sessions recursively saved?',
    a: 'Yes. Every search is automatically archived in your dashboard. You can revisit past sessions, continue the chat contextually, or reference previously synthesized literature at any time.'
  }
];



// ─────────────────────────────────────────────────────────────────────
// Typography tokens used consistently across every section:
//   eyebrow  — JetBrains Mono, 11px, uppercase, 1.5px spacing, --accent
//   h2       — Instrument Serif, 40px, weight 400
//   section-sub — Inter, 16px, --text-secondary, lineHeight 1.65
//   card-title  — Inter, 15px, weight 600, --text-primary
//   card-body   — Inter, 14px, --text-secondary, lineHeight 1.65
// ─────────────────────────────────────────────────────────────────────

const S = {
  eyebrow: {
    fontFamily: 'JetBrains Mono',
    fontSize: 11,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    display: 'block',
    marginBottom: 14,
  },
  sectionH2: {
    fontFamily: 'Instrument Serif',
    fontSize: 'clamp(32px,4vw,42px)',
    fontWeight: 400,
    color: 'var(--text-primary)',
    lineHeight: 1.15,
    marginBottom: 12,
  },
  sectionSub: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 400,
    color: 'var(--text-secondary)',
    lineHeight: 1.65,
    maxWidth: 520,
    marginBottom: 52,
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: 8,
  },
  cardBody: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: 'var(--text-muted)',
    lineHeight: 1.65,
  },
};

// ─────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();
  const { createSession } = useChatStore();
  const { currentUser } = useAppStore();
  const [query, setQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (!currentUser) { navigate('/signup'); return; }
    setIsCreating(true);
    try {
      await createSession({ disease: query.trim(), name: '', location: '' });
      navigate('/research');
    } catch {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); }
  };

  return (
    <>
      <style>{`
        .responsive-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .responsive-footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; align-items: start; }
        .hero-h1 { font-size: clamp(42px, 6vw, 68px); }
        .hero-sub { max-width: 540px; margin: 0 auto 48px; }
        
        @media (max-width: 900px) {
          .responsive-grid-3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .responsive-grid-3 { grid-template-columns: 1fr; }
          .responsive-footer { grid-template-columns: 1fr; text-align: center; }
          .footer-links { text-align: center !important; }
          .footer-logo { justify-content: center; }
          .hero-h1 { font-size: 38px; }
          .hero-sub { font-size: 15px; padding: 0 10px; }
          .search-bar-row { flex-direction: column; align-items: stretch !important; gap: 14px; }
          .search-index-row { justify-content: flex-start; margin-bottom: 10px; }
        }
      `}</style>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

      {/* ══════════════════════════════════════════════════════
          §1 — HERO
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '40px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ maxWidth: '820px', width: '100%', margin: '0 auto' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--accent-light)', border: '1px solid rgba(11,138,116,0.2)',
            borderRadius: 'var(--radius-full)', padding: '6px 18px', marginBottom: 36,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Clinical Mode Active
            </span>
          </div>

          {/* H1 */}
          <h1 className="hero-h1" style={{
            fontFamily: 'Instrument Serif', fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.5px', color: 'var(--text-primary)',
            margin: '0 0 24px',
          }}>
            Synthesize clinical evidence
            <br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>across medical literature.</span>
          </h1>

          {/* Subtext */}
          <p className="hero-sub" style={{
            fontFamily: 'Inter', fontSize: 17, fontWeight: 400,
            color: 'var(--text-secondary)', lineHeight: 1.7,
          }}>
            The AI companion that contextually searches, filters, and reasons over PubMed, OpenAlex, and ClinicalTrials.gov — with surgical precision.
          </p>

          {/* Search card */}
          <div style={{
            width: '100%', maxWidth: '640px', margin: '0 auto',
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '20px 24px',
          }}>
            <textarea
              value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query literature (e.g., 'Efficacy of semaglutide in non-diabetic obesity')…"
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'Inter', fontSize: 15, color: 'var(--text-primary)',
                resize: 'none', minHeight: '52px', lineHeight: 1.6, caretColor: 'var(--accent)',
              }}
              rows={2}
            />
            <div className="search-bar-row" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 10,
            }}>
              {/* Indexing row */}
              <div className="search-index-row" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)' }}>Indexing:</span>
                {['PubMed', 'OpenAlex', 'ClinicalTrials.gov'].map(s => (
                  <span key={s} style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '3px 9px' }}>{s}</span>
                ))}
              </div>
              <button
                onClick={handleSearch} disabled={isCreating || !query.trim()}
                style={{
                  background: query.trim() ? 'var(--accent)' : 'var(--border)',
                  color: query.trim() ? '#fff' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)', padding: '9px 20px', border: 'none',
                  cursor: query.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                  transition: 'all var(--transition)', flexShrink: 0,
                }}
                onMouseEnter={e => { if (query.trim()) { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(11,138,116,0.35)'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = query.trim() ? 'var(--accent)' : 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {isCreating ? 'Starting…' : 'Search literature'}
              </button>
            </div>
          </div>

          {/* Suggestion chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 18 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setQuery(s)}
                style={{
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-full)',
                  padding: '7px 16px', background: 'var(--surface)', cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--surface)'; }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Trust pills */}
          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
            {['Zero hallucinations', 'Real-time data', 'Inline citations', 'Open-source LLM'].map(f => (
              <span key={f} style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--accent)', fontSize: 8 }}>●</span>{f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2 — COMPREHENSIVE DATASETS
      ══════════════════════════════════════════════════════ */}
      <section id="data-sources" style={{ background: 'var(--bg-alt)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          {/* Section header — left-aligned like reference */}
          <div style={{ marginBottom: 48 }}>
            <span style={S.eyebrow}>Data Sources</span>
            <h2 style={{ ...S.sectionH2, marginBottom: 10 }}>Comprehensive datasets</h2>
            <p style={{ ...S.sectionSub, marginBottom: 0 }}>
              Direct integration with the world's most authoritative clinical repositories.
            </p>
          </div>

          {/* Cards */}
          <div className="responsive-grid-3">
            {DATA_SOURCES.map((src, i) => (
              <div key={src.name}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)', padding: '28px 28px 24px',
                  boxShadow: 'var(--shadow-xs)',
                  animation: `fadeUp 0.4s ${i * 80}ms ease forwards`, opacity: 0,
                  transition: 'border-color var(--transition), box-shadow var(--transition), transform var(--transition)',
                  display: 'flex', flexDirection: 'column', gap: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = src.color + '60'; e.currentTarget.style.boxShadow = `0 8px 28px ${src.color}14`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: src.iconBg, color: src.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, flexShrink: 0,
                }}>
                  {src.icon}
                </div>

                {/* Name */}
                <div style={{ ...S.cardTitle, marginBottom: 10 }}>{src.name}</div>

                {/* Description */}
                <p style={{ ...S.cardBody, marginBottom: 20, flex: 1 }}>{src.desc}</p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
                  {src.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                      background: src.iconBg, color: src.iconColor,
                      border: `1px solid ${src.color}28`,
                      borderRadius: 'var(--radius-sm)', padding: '4px 10px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3 — HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section id="workflow" style={{ background: 'var(--bg)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ ...S.eyebrow, display: 'block', textAlign: 'center' }}>Workflow</span>
          <h2 style={{ ...S.sectionH2, textAlign: 'center' }}>From question to evidence in seconds</h2>
          <p style={{ ...S.sectionSub, margin: '0 auto 60px' }}>
            Three steps — ask, search, synthesize
          </p>

          <div className="responsive-grid-3" style={{ position: 'relative' }}>
            {/* connector line - hidden on mobile via simplified implementation */}
            <div style={{
              position: 'absolute', top: 22, left: 'calc(16.66% + 22px)',
              right: 'calc(16.66% + 22px)', height: 1,
              borderTop: '1px dashed var(--border)', pointerEvents: 'none',
            }} />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.n} style={{ padding: '0 10px', textAlign: 'center', animation: `fadeUp 0.4s ${i * 80}ms ease forwards`, opacity: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: '1.5px solid var(--border)', background: 'var(--surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', boxShadow: 'var(--shadow-xs)',
                  fontFamily: 'JetBrains Mono', fontSize: 15, color: 'var(--accent)',
                }}>
                  {step.n}
                </div>
                <h3 style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)', marginTop: 20, marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ ...S.cardBody, maxWidth: 260, margin: '0 auto' }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4 — FEATURES
      ══════════════════════════════════════════════════════ */}
      <section id="features" style={{ background: 'var(--bg-alt)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ ...S.eyebrow, display: 'block', textAlign: 'center' }}>Why Curalink</span>
          <h2 style={{ ...S.sectionH2, textAlign: 'center' }}>Built for serious clinical research</h2>
          <p style={{ ...S.sectionSub, margin: '0 auto 52px' }}>
            Every design decision prioritizes accuracy, traceability, and clinical utility.
          </p>

          <div className="responsive-grid-3">
            {FEATURES.map((f, i) => (
              <div key={f.title}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '22px 24px', textAlign: 'left',
                  animation: `fadeUp 0.4s ${i * 70}ms ease forwards`, opacity: 0,
                  transition: 'border-color var(--transition), box-shadow var(--transition), transform var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(11,138,116,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '1px', color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase' }}>
                  ✓ Guaranteed
                </div>
                <h3 style={{ ...S.cardTitle, marginBottom: 8 }}>{f.title}</h3>
                <p style={S.cardBody}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5 — EXAMPLE OUTPUT
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--bg)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ ...S.eyebrow, display: 'block', textAlign: 'center' }}>Example Output</span>
          <h2 style={{ ...S.sectionH2, textAlign: 'center' }}>What a synthesized response looks like</h2>
          <p style={{ ...S.sectionSub, margin: '0 auto 48px' }}>
            Structured, cited, and grounded in peer-reviewed literature — every time.
          </p>

          {/* Product Screenshot Wrapper */}
          <div style={{
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            maxWidth: '1040px',
            margin: '0 auto',
            background: 'var(--surface)',
            transform: 'translateY(0)',
            transition: 'transform var(--transition), box-shadow var(--transition)',
            animation: 'fadeUp 0.6s ease forwards'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 32px 72px rgba(0,0,0,0.16)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.12)'; }}
          >
            {/* Fake macOS Chrome Bar */}
            <div style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)', marginLeft: 10, fontWeight: 500 }}>
                curalink.ai/research
              </span>
            </div>

            {/* Main Application Image */}
            <img
              src="/app-screenshot.png"
              alt="Curalink AI Clinical Interface"
              style={{ width: '100%', height: 'auto', display: 'block', borderBottom: '1px solid var(--border)' }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §6 — FAQ
      ══════════════════════════════════════════════════════ */}
      <section id="faq" style={{ background: 'var(--bg-alt)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ ...S.eyebrow, display: 'block', textAlign: 'center' }}>Questions & Answers</span>
          <h2 style={{ ...S.sectionH2, textAlign: 'center' }}>Frequently asked questions</h2>
          <p style={{ ...S.sectionSub, margin: '0 auto 52px', textAlign: 'center' }}>
            Everything you need to know about Curalink AI and our research methodology.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <style>{`
              details.faq-item > summary {
                list-style: none; /* Hide default arrow */
                cursor: pointer;
                outline: none;
              }
              details.faq-item > summary::-webkit-details-marker {
                display: none;
              }
              details.faq-item[open] .faq-icon {
                transform: rotate(45deg);
              }
            `}</style>

            {FAQS.map((faq, i) => (
              <details key={i} className="faq-item" style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '0',
                transition: 'border-color var(--transition), box-shadow var(--transition)',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <summary style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {faq.q}
                  </span>
                  <div className="faq-icon" style={{
                    width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: 'var(--text-muted)', transition: 'transform 0.2s ease, color 0.2s ease',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </summary>
                <div style={{ padding: '0 24px 24px', fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    {faq.a}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §7 — DARK CTA
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--dark-bg)', padding: '100px 24px', textAlign: 'center' }}>
        <span style={{ ...S.eyebrow, display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Get started</span>
        <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 400, color: '#fff', marginBottom: 16, lineHeight: 1.15 }}>
          Start researching now
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>
          Free to use · No account required · Open-source LLM
        </p>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: '#fff', color: 'var(--text-primary)',
            borderRadius: 'var(--radius-full)', padding: '15px 40px',
            fontFamily: 'Inter', fontSize: 15, fontWeight: 600,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'transform var(--transition), box-shadow var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}
        >
          Get started free →
        </button>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)', padding: '40px 24px' }}>
        <div className="responsive-footer" style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div>
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src="/logo.png" alt="CuraLink Logo" style={{ width: 30, height: 30, borderRadius: '8px', objectFit: 'contain', flexShrink: 0, background: '#fff', padding: '2px' }} />
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#fff' }}>
                Curalink<span style={{ color: 'var(--accent)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 260 }}>
              © {new Date().getFullYear()} Curalink AI. Surgical precision in clinical insight.
            </p>
          </div>
          <div />
          <div className="footer-links" style={{ textAlign: 'right' }}>
            {['Privacy Policy', 'Terms of Service', 'Compliance', 'Contact'].map(l => (
              <a key={l} href="#"
                style={{ display: 'block', fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: 8, transition: 'color var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
