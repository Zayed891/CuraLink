import React from 'react';

export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md overflow-hidden ${
        hover ? 'transition-all hover:-translate-y-[1px] hover:border-[var(--color-accent)] hover:shadow-md' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
