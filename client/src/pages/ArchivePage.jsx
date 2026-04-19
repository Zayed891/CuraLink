import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../store/chatStore';
import useAppStore from '../store/appStore';

const FILTERS = ['All', 'Publications', 'Clinical Trials', 'By Patient'];

export default function ArchivePage() {
  const navigate = useNavigate();
  const { sessions, setActiveSession, fetchSessions } = useChatStore();
  const { patients } = useAppStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filtered = sessions.filter(s => {
    const matchSearch = !search || (s.disease || '').toLowerCase().includes(search.toLowerCase()) || (s.name || '').toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleOpen = (session) => {
    setActiveSession(session.sessionId);
    navigate('/research');
  };

  return (
    <>
      <style>{`
        .archive-container { padding: 32px 40px; flex: 1; overflow-y: auto; }
        .archive-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .filter-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .search-wrapper { position: relative; width: 280px; }
        
        @media (max-width: 900px) {
          .archive-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .archive-container { padding: 20px 16px; }
          .search-wrapper { width: 100%; }
        }
      `}</style>
      <div className="archive-container">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Research Archive
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)' }}>
          All your past research sessions, organized by patient and condition.
        </p>
      </div>

      {/* Filter row */}
      <div className="filter-row">
        {/* Search */}
        <div className="search-wrapper">
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text" placeholder="Search sessions…" value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              padding: '10px 14px 10px 36px', fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)',
              background: 'var(--surface)', outline: 'none', transition: 'border-color var(--transition)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--accent)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-full)', padding: '6px 16px',
                fontFamily: 'Inter', fontSize: 13, fontWeight: filter === f ? 600 : 400,
                cursor: 'pointer', transition: 'all var(--transition)',
              }}
              onMouseEnter={e => { if (filter !== f) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; } }}
              onMouseLeave={e => { if (filter !== f) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Archive grid */}
      {filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 28, color: 'var(--text-muted)', marginBottom: '12px' }}>
            {sessions.length === 0 ? 'No sessions yet' : 'No results found'}
          </div>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)', marginBottom: '24px' }}>
            {sessions.length === 0 ? 'Start a research session to build your archive.' : 'Try adjusting your search.'}
          </p>
          {sessions.length === 0 && (
            <button onClick={() => navigate('/research')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 24px', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Start Research →
            </button>
          )}
        </div>
      ) : (
        <div className="archive-grid">
          {filtered.map((session, i) => {
            const sessionName = session.patientContext?.name || session.name;
            const sessionDisease = session.patientContext?.disease || session.disease;
            const patient = patients.find(p => p.name === sessionName);
            const initials = sessionName ? sessionName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
            return (
              <div
                key={session.sessionId}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                  animation: `fadeUp 0.4s ${i * 60}ms ease forwards`, opacity: 0,
                  transition: 'border-color var(--transition), box-shadow var(--transition)',
                  cursor: 'pointer',
                }}
                onClick={() => handleOpen(session)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: 'var(--accent)', flexShrink: 0 }}>
                      {initials}
                    </div>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sessionName || 'Anonymous'}
                    </span>
                    {sessionDisease && (
                      <span style={{ background: 'var(--accent-light)', border: '1px solid rgba(11,138,116,0.15)', borderRadius: 'var(--radius-full)', padding: '2px 10px', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent)' }}>
                        {sessionDisease.slice(0, 20)}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                    {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>

                {/* Query text */}
                <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, margin: '10px 0 14px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {session.disease || 'Research session'}
                  {session.location ? ` · ${session.location}` : ''}
                </p>

                {/* Stats row */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)' }}>📄 Research</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)' }}>🔬 Trials</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); handleOpen(session); }} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '6px 14px', fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all var(--transition)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    Open Session
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}
