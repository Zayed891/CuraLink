import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
    primary: 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border-[var(--color-accent-dim)]',
    success: 'bg-[#22C55E20] text-[var(--color-success)] border-[#22C55E30]',
    warning: 'bg-[#F59E0B20] text-[var(--color-warning)] border-[#F59E0B30]',
    PubMed: 'bg-[#3B9EFF20] text-[#3B9EFF] border-[#3B9EFF30]',
    OpenAlex: 'bg-[#8B5CF620] text-[#8B5CF6] border-[#8B5CF630]',
  };

  const style = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      {children}
    </span>
  );
}
