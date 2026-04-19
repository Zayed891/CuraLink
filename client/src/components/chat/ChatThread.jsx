import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatThread({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingTop: '24px', paddingBottom: '8px' }}>
      {messages.map((msg, index) => (
        <ChatMessage key={msg._id || index} message={msg} index={index} />
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div style={{ padding: '0 24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '16px 0' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)',
                  animation: `pulse 1.2s ${i * 0.2}s ease infinite`,
                }}
              />
            ))}
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', marginLeft: '10px' }}>
              Synthesizing research…
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} style={{ height: '8px' }} />
    </div>
  );
}
