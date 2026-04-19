import React, { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSendMessage, isLoading, placeholder }) {
  const [content, setContent] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (!content.trim() || isLoading) return;
    onSendMessage(content.trim());
    setContent('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <div style={{
      padding: '12px 40px 20px',
      background: 'var(--bg)',
      flexShrink: 0,
    }}>
      {/* Pill input bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--surface)', border: '1.5px solid var(--border)',
        borderRadius: 50, padding: '10px 12px 10px 18px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        transition: 'border-color var(--transition), box-shadow var(--transition)',
      }}
        onFocus={() => {}}
        // highlight on child focus
        onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(11,138,116,0.4)'; e.currentTarget.style.boxShadow = '0 2px 20px rgba(11,138,116,0.1)'; }}
        onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; }}
      >
        {/* Attachment icon */}
        <button type="button" tabIndex={-1}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 4px', flexShrink: 0, display: 'flex', alignItems: 'center', transition: 'color var(--transition)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (isLoading ? 'Synthesizing research…' : 'Ask a follow-up question or request specific clinical trial data…')}
          disabled={isLoading}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)',
            caretColor: 'var(--accent)',
          }}
        />
        <style>{`input::placeholder { color: var(--text-muted); }`}</style>

        {/* Mic icon */}
        <button type="button" tabIndex={-1}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 4px', flexShrink: 0, display: 'flex', alignItems: 'center', transition: 'color var(--transition)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>

        {/* Send button — teal circle */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: content.trim() && !isLoading ? 'var(--accent)' : 'var(--border)',
            color: content.trim() && !isLoading ? '#fff' : 'var(--text-muted)',
            cursor: content.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { if (content.trim() && !isLoading) { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'scale(1.06)'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = content.trim() && !isLoading ? 'var(--accent)' : 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isLoading ? (
            <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinLoader 0.8s linear infinite' }} />
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>

      {/* Disclaimer */}
      <p style={{
        fontFamily: 'Inter', fontSize: 11, color: 'var(--text-muted)',
        textAlign: 'center', marginTop: 8,
      }}>
        Curalink AI can make mistakes. Verify critical clinical insights.
      </p>
    </div>
  );
}
