import React, { useState } from 'react';

export default function PublicationCard({ pub }) {
  const [expanded, setExpanded] = useState(false);
  const { title, year, source, authors, url, abstract } = pub;

  const isPubMed = source?.toLowerCase() === 'pubmed';
  const isOpenAlex = source?.toLowerCase() === 'openalex';

  const badgeStyle = isPubMed
    ? { background: '#FEE2E2', color: '#C0392B', border: '1px solid #FCA5A5' }
    : isOpenAlex
    ? { background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #93C5FD' }
    : { background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(11,138,116,0.25)' };

  return (
    <div
      style={{
        background: 'var(--surface-raised)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '16px', margin: '12px',
        transition: 'border-color var(--transition), box-shadow var(--transition), transform var(--transition)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Top row: badge + year */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...badgeStyle, fontFamily: 'JetBrains Mono', fontSize: 10, borderRadius: 'var(--radius-sm)', padding: '2px 8px' }}>
          {source || 'Unknown'}
        </span>
        {year && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)' }}>{year}</span>}
      </div>

      {/* Title */}
      <h4 style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginTop: '8px' }}>
        {title}
      </h4>

      {/* Authors */}
      {authors && (
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {Array.isArray(authors) ? authors.join(', ') : authors}
        </div>
      )}

      {/* Abstract */}
      {abstract && (
        <div style={{ marginTop: '10px' }}>
          <div style={{
            fontFamily: 'Inter', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
            overflow: expanded ? 'visible' : 'hidden',
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 3,
            WebkitBoxOrient: expanded ? 'unset' : 'vertical',
          }}>
            {abstract}
          </div>
          {abstract.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, color: 'var(--accent)', padding: 0, marginTop: '4px' }}
            >
              {expanded ? 'Read less ↑' : 'Read more ↓'}
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      {url && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '12px' }}>
          <a
            href={url} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', display: 'block', textAlign: 'right', transition: 'color var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            View Source ↗
          </a>
        </div>
      )}
    </div>
  );
}
