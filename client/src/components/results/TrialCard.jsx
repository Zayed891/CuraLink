import React from 'react';

export default function TrialCard({ trial }) {
  const { title, status, location, contact, summary, phase, url } = trial;

  const statusUpper = status?.toUpperCase() || '';
  const isRecruiting = statusUpper.includes('RECRUITING');
  const isActive = statusUpper.includes('ACTIVE');
  const isCompleted = statusUpper.includes('COMPLETED');

  const statusStyle = isRecruiting
    ? { background: 'var(--recruiting-bg)', color: 'var(--recruiting)', border: '1px solid rgba(11,138,116,0.2)' }
    : isActive
    ? { background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(180,83,9,0.2)' }
    : { background: 'var(--bg-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' };

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
      {/* Status + phase */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ ...statusStyle, fontFamily: 'JetBrains Mono', fontSize: 10, borderRadius: 'var(--radius-full)', padding: '3px 10px' }}>
          {isRecruiting ? '● ' : ''}{status || 'Unknown'}
        </span>
        {phase && phase !== 'N/A' && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(11,138,116,0.2)', borderRadius: 'var(--radius-full)', padding: '3px 10px' }}>
            {phase}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '8px' }}>
        {title}
      </h4>

      {/* Summary */}
      {summary && (
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {summary}
        </p>
      )}

      {/* Location + contact */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
        {location && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)' }}>
            <span>📍</span><span>{location}</span>
          </div>
        )}
        {contact && contact !== 'Contact not available' && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)' }}>
            <span>👤</span><span>{contact}</span>
          </div>
        )}
      </div>

      {/* Link */}
      {url && (
        <a
          href={url} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            width: '100%', padding: '8px 12px', background: 'var(--bg-alt)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
            textDecoration: 'none', transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-alt)'; }}
        >
          View Registry ↗
        </a>
      )}
    </div>
  );
}
