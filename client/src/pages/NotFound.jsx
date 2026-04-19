import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '16px' }}>
        404 · PAGE NOT FOUND
      </div>
      <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '16px' }}>
        This page doesn't exist
      </h1>
      <p style={{ fontFamily: 'Inter', fontSize: 16, color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '40px', lineHeight: 1.6 }}>
        The page you're looking for may have been moved, deleted, or never existed.
      </p>
      <Link to="/" style={{
        background: 'var(--accent)', color: '#fff', textDecoration: 'none',
        borderRadius: 'var(--radius-full)', padding: '12px 32px',
        fontFamily: 'Inter', fontSize: 15, fontWeight: 600,
        transition: 'all var(--transition)',
        display: 'inline-block',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(11,138,116,0.35)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        ← Back to home
      </Link>
    </div>
  );
}
