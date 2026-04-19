import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import useChatStore from '../store/chatStore';

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 24px',
      animation: 'fadeUp 0.4s ease forwards',
    }}>
      <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Instrument Serif', fontSize: 36, color: 'var(--text-primary)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--accent)', marginTop: '8px' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function PatientAvatar({ name, size = 38 }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'PT';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter', fontWeight: 600, fontSize: size < 36 ? 11 : 13, color: 'var(--accent)', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, patients, setActivePatient, setAddPatientModalOpen } = useAppStore();
  const { sessions, setActiveSession, fetchSessions } = useChatStore();

  useEffect(() => {
    fetchSessions(); // pull real sessions from MongoDB
  }, [fetchSessions]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Compute stats
  const totalPublications = sessions.reduce((acc, s) => acc + (s.pubCount || 0), 0);
  const totalTrials = sessions.reduce((acc, s) => acc + (s.trialCount || 0), 0);

  const handleOpenSession = (session) => {
    setActiveSession(session.sessionId);
    navigate('/research');
  };

  const handlePatientClick = (patient) => {
    setActivePatient(patient);
    navigate('/research');
  };

  return (
    <>
      <style>{`
        .dash-container { padding: 32px 40px; flex: 1; overflow-y: auto; }
        .dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        .dash-row { display: grid; grid-template-columns: 60% 40%; gap: 24px; }
        
        @media (max-width: 1024px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .dash-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .dash-container { padding: 20px 16px; }
          .dash-stats { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="dash-container">
      {/* Greeting row */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {greeting()}, {currentUser?.name || 'Doctor'}
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)' }}>{today}</p>
      </div>

      {/* Stat cards */}
      <div className="dash-stats">
        <StatCard label="Active Patients" value={patients.length} />
        <StatCard label="Research Sessions" value={sessions.length} />
        <StatCard label="Publications Reviewed" value={totalPublications} />
        <StatCard label="Trials Identified" value={totalTrials} />
      </div>

      {/* Two-column row */}
      <div className="dash-row">
        {/* Left — Recent sessions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              Recent Research Sessions
            </h2>
            {sessions.length > 0 && (
              <button onClick={() => navigate('/archive')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, color: 'var(--accent)' }}>
                View all
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 24, color: 'var(--text-muted)', marginBottom: '8px' }}>No sessions yet</div>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)', marginBottom: '20px' }}>Add a patient and start your first research session.</p>
              <button onClick={() => navigate('/research')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 24px', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Start Research →
              </button>
            </div>
          ) : (
            sessions.slice(0, 6).map((session) => {
              const sessionName = session.patientContext?.name || session.name;
              const sessionDisease = session.patientContext?.disease || session.disease;
              
              return (
              <div
                key={session.sessionId}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '16px 20px',
                  marginBottom: '10px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', cursor: 'pointer',
                  transition: 'border-color var(--transition), box-shadow var(--transition)',
                }}
                onClick={() => handleOpenSession(session)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {sessionName || 'Anonymous Patient'}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                    {sessionDisease || 'Research session'}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {sessionDisease && (
                      <span style={{ background: 'var(--accent-light)', border: '1px solid rgba(11,138,116,0.2)', borderRadius: 'var(--radius-full)', padding: '2px 10px', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent)' }}>
                        {sessionDisease.slice(0, 20)}{sessionDisease.length > 20 ? '…' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: '16px', textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)' }}>
                    {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : ''}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--accent)', marginTop: '8px' }}>
                    Open →
                  </div>
                </div>
              </div>
            )})
          )}
        </div>

        {/* Right — Patient overview */}
        <div>
          <h2 style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Patient Overview
          </h2>

          {patients.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '30px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)', marginBottom: '16px' }}>No patients yet.</p>
              <button onClick={() => setAddPatientModalOpen(true)} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 20px', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                + Add patient
              </button>
            </div>
          ) : (
            <>
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient)}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '14px 18px',
                    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px',
                    cursor: 'pointer',
                    transition: 'border-color var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <PatientAvatar name={patient.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {patient.name}
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-secondary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {patient.primaryCondition || 'No condition set'}
                    </div>
                  </div>
                  {patient.primaryCondition && (
                    <span style={{ background: 'var(--recruiting-bg)', border: '1px solid rgba(11,138,116,0.2)', borderRadius: 'var(--radius-full)', padding: '2px 10px', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--recruiting)', flexShrink: 0 }}>
                      Active
                    </span>
                  )}
                </div>
              ))}

              <button onClick={() => setAddPatientModalOpen(true)} style={{ width: '100%', background: 'none', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', cursor: 'pointer', marginTop: '4px', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}>
                + Add new patient
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
