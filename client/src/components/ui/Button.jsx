import React from 'react';

export default function Button({ children, onClick, type = 'button', disabled = false, isLoading = false, variant = 'accent', size = 'md', className = '', style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    fontFamily: 'Inter', fontWeight: 600, cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    border: 'none', outline: 'none', transition: 'all 160ms cubic-bezier(0.4,0,0.2,1)',
    textDecoration: 'none',
  };

  const sizes = {
    sm: { fontSize: 13, padding: '8px 16px', borderRadius: '10px' },
    md: { fontSize: 14, padding: '10px 22px', borderRadius: '12px' },
    lg: { fontSize: 15, padding: '13px 28px', borderRadius: '14px' },
  };

  const variants = {
    accent: { background: disabled ? '#E4E4DC' : '#0B8A74', color: disabled ? '#9C9C90' : '#fff' },
    ghost:  { background: 'transparent', color: '#5C5C52', border: '1px solid #E4E4DC' },
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => {
        if (!disabled && !isLoading && variant === 'accent') {
          e.currentTarget.style.background = '#0FA88D';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(11,138,116,0.35)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = variants[variant].background;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {isLoading && (
        <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinLoader 0.8s linear infinite' }} />
      )}
      {children}
    </button>
  );
}
