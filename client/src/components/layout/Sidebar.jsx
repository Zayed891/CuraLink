import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAppStore from '../../store/appStore';
import useChatStore from '../../store/chatStore';
import AddPatientModal from '../onboarding/AddPatientModal';

const NAV = [
  {
    path: '/research',
    label: 'Workspace',
    icon: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  },
  {
    path: '/archive',
    label: 'Library',
    icon: <><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></>,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  },
];

function Icon({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, patients, activePatient, setActivePatient, patientSessionMap, setAddPatientModalOpen, addPatientModalOpen, logout } = useAppStore();
  const { loadHistory } = useChatStore();

  const isActive = (path) => location.pathname === path;

  const handlePatientClick = (patient) => {
    setActivePatient(patient);
    navigate('/research');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DR';

  return (
    <>
      <style>{`
        .app-sidebar {
          width: 220px; min-width: 220px; height: 100%;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          overflow: hidden;
          transition: transform var(--transition);
          z-index: 100;
        }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 90; backdrop-filter: blur(2px); animation: fadeIn 0.2s ease; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 768px) {
          .app-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
            width: 280px; min-width: 280px;
          }
          .app-sidebar.open { transform: translateX(0); }
          .sidebar-overlay.open { display: block; }
        }
      `}</style>
      
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>

        {/* ── User identity ─────────────────────────────── */}
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'var(--accent-light)', border: '2px solid rgba(11,138,116,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: 'var(--accent)',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
                color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {currentUser?.name || 'Doctor'}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '1.2px',
                textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 2,
              }}>
                Clinical Portal
              </div>
            </div>
          </div>
        </div>

        {/* ── Nav items ─────────────────────────────────── */}
        <nav style={{ padding: '12px 12px 0', flex: 0 }}>
          {NAV.map(({ path, label, icon }) => {
            const active = isActive(path);
            return (
              <button key={path} onClick={() => navigate(path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', border: 'none', borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--accent-light)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'Inter', fontSize: 14, fontWeight: active ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left', marginBottom: 2,
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-alt)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0 }}>
                  {icon}
                </svg>
                {label}
              </button>
            );
          })}
        </nav>

        {/* ── Patients ──────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 0' }}>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            padding: '0 4px', marginBottom: 10,
          }}>
            Patients
          </div>

          {/* Add patient btn */}
          <button onClick={() => setAddPatientModalOpen(true)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-md)', background: 'none', cursor: 'pointer',
              fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)',
              marginBottom: 8, transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New patient
          </button>

          {patients.length === 0 ? (
            <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)', padding: '8px 4px', lineHeight: 1.6, fontStyle: 'italic' }}>
              No patients added yet.
            </p>
          ) : (
            patients.map(patient => {
              const active = activePatient?.id === patient.id;
              const hasSession = !!patientSessionMap?.[patient.id];
              const initials2 = patient.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <button key={patient.id} onClick={() => handlePatientClick(patient)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', border: 'none',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                    background: active ? 'var(--accent-light)' : 'transparent',
                    borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                    marginBottom: 2, transition: 'all var(--transition)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-alt)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: active ? 'rgba(11,138,116,0.2)' : 'var(--bg-alt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Inter', fontWeight: 600, fontSize: 11,
                    color: active ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0,
                  }}>
                    {initials2}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Inter', fontSize: 13, fontWeight: active ? 600 : 400,
                      color: active ? 'var(--accent)' : 'var(--text-primary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {patient.name}
                    </div>
                    <div style={{
                      fontFamily: 'Inter', fontSize: 11, color: 'var(--text-muted)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1,
                    }}>
                      {patient.primaryCondition || 'No condition'}
                    </div>
                  </div>
                  {hasSession && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  )}
                </button>
              );
            })
          )}
        </div>


        {/* ── Bottom links ──────────────────────────────── */}
        <div style={{ padding: '12px 12px 20px', borderTop: '1px solid var(--border)', marginTop: 16, flexShrink: 0 }}>
          {[
            { label: 'Help', icon: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></> },
          ].map(({ label, icon }) => (
            <button key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)', width: '100%', borderRadius: 'var(--radius-md)', transition: 'all var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-alt)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              {label}
            </button>
          ))}
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)', width: '100%', borderRadius: 'var(--radius-md)', transition: 'all var(--transition)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--error-bg)'; e.currentTarget.style.color = 'var(--error)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <AddPatientModal isOpen={addPatientModalOpen} onClose={() => setAddPatientModalOpen(false)} />
    </>
  );
}
