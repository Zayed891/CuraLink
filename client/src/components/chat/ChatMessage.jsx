import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message, index }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '8px 40px',
        animation: 'fadeUp 0.25s ease forwards',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '14px 20px',
          maxWidth: 580,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <p style={{
            fontFamily: 'Inter', fontSize: 15, lineHeight: 1.65,
            color: 'var(--text-primary)', whiteSpace: 'pre-wrap', margin: 0,
          }}>
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  // Assistant — heading + flowing body text (no bubble)
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '12px 40px 20px',
      animation: 'fadeUp 0.3s ease forwards',
    }}>
      {/* Small teal dot avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'var(--accent-light)', border: '1.5px solid rgba(11,138,116,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 4,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2"/>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, maxWidth: 720 }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // H2/H3 — large serif headings like reference image
            h1: ({ children }) => (
              <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 26, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 10, marginTop: 0, lineHeight: 1.3 }}>
                {children}
              </h2>
            ),
            h2: ({ children }) => (
              <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 8, marginTop: 24, lineHeight: 1.3 }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, marginTop: 20 }}>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 14, marginTop: 0 }}>
                {children}
              </p>
            ),
            strong: ({ children }) => {
              const text = String(children);
              // Section headers like **Condition Overview**
              const sectionLabels = ['Condition Overview', 'Research Insights', 'Clinical Trials', 'Personalized Recommendation', 'Important Note', 'Key Findings'];
              if (sectionLabels.some(l => text.includes(l))) {
                return (
                  <div style={{
                    fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: 'var(--accent)',
                    borderBottom: '1px solid var(--border)', paddingBottom: 8,
                    marginBottom: 14, marginTop: 24, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                    {text}
                  </div>
                );
              }
              // Citation chips [PUB1], [TRIAL1]
              if (/^\[(PUB|TRIAL)\d+\]$/i.test(text)) {
                return (
                  <span style={{
                    display: 'inline-flex', background: 'var(--accent-light)',
                    border: '1px solid rgba(11,138,116,0.25)', borderRadius: 4,
                    padding: '1px 7px', fontFamily: 'JetBrains Mono', fontSize: 11,
                    color: 'var(--accent)', margin: '0 2px', verticalAlign: 'middle',
                  }}>
                    {text}
                  </span>
                );
              }
              return <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{children}</strong>;
            },
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid rgba(11,138,116,0.3)' }}>
                {children}
              </a>
            ),
            ul: ({ children }) => <ul style={{ paddingLeft: '1.5em', marginBottom: 14 }}>{children}</ul>,
            ol: ({ children }) => <ol style={{ paddingLeft: '1.5em', marginBottom: 14 }}>{children}</ol>,
            li: ({ children }) => (
              <li style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 5 }}>
                {children}
              </li>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
