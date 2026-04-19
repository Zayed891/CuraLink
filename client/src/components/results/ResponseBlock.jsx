import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Microscope, FileText, FlaskConical, AlertCircle, Activity } from 'lucide-react';

const SECTION_ICONS = {
  'Condition Overview': Activity,
  'Research Insights': FileText,
  'Clinical Trials': FlaskConical,
  'Personalized Recommendation': Microscope,
  'Important Note': AlertCircle,
};

function SectionHeader({ icon: Icon, label, count, isWarning }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '16px', marginTop: '32px',
    }}>
      {Icon && (
        <Icon size={16} strokeWidth={2} style={{ color: isWarning ? 'var(--warning)' : 'var(--accent)', flexShrink: 0 }} />
      )}
      <span style={{
        fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '1.2px',
        color: isWarning ? 'var(--warning)' : 'var(--accent)', textTransform: 'uppercase',
      }}>
        {label}
      </span>
      {count != null && (
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '2px 8px', marginLeft: 'auto',
        }}>
          {count} sources
        </span>
      )}
    </div>
  );
}

export default function ResponseBlock({ content, publications = [], clinicalTrials = [] }) {
  const customRenderers = {
    p: ({ children }) => (
      <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '16px' }}>
        {children}
      </p>
    ),
    h1: ({ children }) => <h3 style={{ fontFamily: 'Instrument Serif', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>{children}</h3>,
    h2: ({ children }) => <h3 style={{ fontFamily: 'Instrument Serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', marginTop: '28px', marginBottom: '10px' }}>{children}</h3>,
    h3: ({ children }) => <h4 style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '8px' }}>{children}</h4>,
    strong: ({ children }) => {
      const text = String(children);

      // Section headers
      const matchedSection = Object.keys(SECTION_ICONS).find(k => text.includes(k));
      if (matchedSection) {
        const Icon = SECTION_ICONS[matchedSection];
        const isWarning = matchedSection === 'Important Note';
        return (
          <SectionHeader
            icon={Icon}
            label={matchedSection}
            count={matchedSection === 'Research Insights' ? publications.length : null}
            isWarning={isWarning}
          />
        );
      }

      // Inline citation chips [PUB1], [TRIAL1]
      const pubMatch = text.match(/\[PUB(\d+)\]/i) || text.match(/\[TRIAL(\d+)\]/i);
      if (pubMatch) {
        return (
          <span style={{
            display: 'inline-flex', background: 'var(--accent-light)',
            border: '1px solid rgba(11,138,116,0.25)', borderRadius: '4px',
            padding: '1px 7px', fontFamily: 'JetBrains Mono', fontSize: 11,
            color: 'var(--accent)', cursor: 'pointer', verticalAlign: 'middle', margin: '0 2px',
            transition: 'background var(--transition)',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(11,138,116,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-light)'}
          >
            {pubMatch[0].toUpperCase()}
          </span>
        );
      }

      return <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{children}</strong>;
    },
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noreferrer"
        style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color var(--transition)' }}
        onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => <ul style={{ paddingLeft: '1.4em', marginBottom: '16px' }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ paddingLeft: '1.4em', marginBottom: '16px' }}>{children}</ol>,
    li: ({ children }) => <li style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '4px' }}>{children}</li>,
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customRenderers}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
