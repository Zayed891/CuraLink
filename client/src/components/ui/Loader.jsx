import React from 'react';

export default function Loader({ size = 'md', text = 'Loading…', color = 'var(--accent)' }) {
  const dim = size === 'sm' ? 16 : size === 'lg' ? 32 : 22;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: dim, height: dim,
        border: `2.5px solid rgba(11,138,116,0.2)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spinLoader 0.8s linear infinite',
        flexShrink: 0,
      }} />
      {text && (
        <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)' }}>
          {text}
        </span>
      )}
    </div>
  );
}
