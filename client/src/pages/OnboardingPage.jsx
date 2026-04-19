import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';

const ROLES = ['Medical Officer', 'Researcher', 'Clinician', 'General Practitioner', 'Specialist', 'Other'];

// Step progress indicator
function StepBar({ current, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: '40px' }}>
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <React.Fragment key={i}>
            {/* Circle */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: done ? 'var(--accent)' : active ? 'var(--accent-light)' : 'var(--surface)',
              border: done ? 'none' : active ? '2px solid var(--accent)' : '2px solid var(--border)',
              fontFamily: 'JetBrains Mono', fontSize: 14,
              color: done ? '#fff' : active ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'all var(--transition-slow)',
            }}>
              {done ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : stepNum}
            </div>
            {/* Line */}
            {i < total - 1 && (
              <div style={{
                height: '2px', flex: 1, maxWidth: '80px',
                background: done ? 'var(--accent)' : 'var(--border)',
                transition: 'background var(--transition-slow)',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { currentUser, updateUser, addPatient } = useAppStore();
  const [step, setStep] = useState(1);
  const TOTAL = 3;

  // Step 1 state
  const [profile, setProfile] = useState({
    role: currentUser?.role || '',
    institution: currentUser?.institution || '',
    country: currentUser?.country || '',
    licenseNumber: '',
  });

  // Step 2 state
  const [patient, setPatient] = useState({ name: '', dob: '', primaryCondition: '', location: '', notes: '' });
  const [secondaryConditions, setSecondaryConditions] = useState([]);
  const [condInput, setCondInput] = useState('');

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '12px 16px',
    fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)',
    caretColor: 'var(--accent)', outline: 'none', transition: 'all var(--transition)',
    display: 'block', marginBottom: '16px',
  };
  const handleFocus = (e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; };
  const handleBlur  = (e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  const selectStyle = { ...inputStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' };

  const handleStep1 = (e) => {
    e.preventDefault();
    updateUser(profile);
    setStep(2);
  };

  const addTag = (val) => {
    const t = val.trim();
    if (t && !secondaryConditions.includes(t)) setSecondaryConditions(p => [...p, t]);
    setCondInput('');
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (patient.name.trim() && patient.primaryCondition.trim()) {
      addPatient({ ...patient, secondaryConditions });
    }
    setStep(3);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <img src="/logo.png" alt="CuraLink Logo" style={{ width: 32, height: 32, borderRadius: '8px', objectFit: 'contain', flexShrink: 0, background: '#fff', padding: '2px', boxShadow: '0 2px 8px rgba(11,138,116,0.15)' }} />
        <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
          Curalink<span style={{ color: 'var(--accent)' }}>AI</span>
        </span>
      </div>

      {/* Card */}
      <div style={{
        maxWidth: '600px', width: '100%',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: '48px',
      }}>
        <StepBar current={step} total={TOTAL} />

        {/* ─── STEP 1 ─────────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 28, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Tell us about yourself
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Help us personalise your research experience
            </p>

            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Full name</label>
            <input style={{ ...inputStyle, background: 'var(--bg-alt)', color: 'var(--text-muted)' }} value={currentUser?.name || ''} disabled />

            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Role</label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <select value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}
                style={selectStyle} onFocus={handleFocus} onBlur={handleBlur}>
                <option value="">Select role</option>
                {ROLES.map(s => <option key={s}>{s}</option>)}
              </select>
              <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Institution / Hospital</label>
            <input type="text" placeholder="e.g. Toronto General Hospital" value={profile.institution}
              onChange={e => setProfile(p => ({ ...p, institution: e.target.value }))}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />

            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Country</label>
            <input type="text" placeholder="e.g. United States" value={profile.country}
              onChange={e => setProfile(p => ({ ...p, country: e.target.value }))}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />

            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              License number <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input type="text" placeholder="e.g. MD-123456" value={profile.licenseNumber}
              onChange={e => setProfile(p => ({ ...p, licenseNumber: e.target.value }))}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />

            <button type="submit" style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '14px', fontFamily: 'Inter', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: '8px', transition: 'all var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Continue →
            </button>
          </form>
        )}

        {/* ─── STEP 2 ─────────────────────────────────────────── */}
        {step === 2 && (
          <form onSubmit={handleStep2}>
            <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 28, color: 'var(--text-primary)', marginBottom: '8px' }}>Add your first patient</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text-secondary)', marginBottom: '32px' }}>
              You can add more patients anytime from the dashboard
            </p>

            {[
              { label: 'Patient name', name: 'name', type: 'text', ph: 'e.g. Jane Smith' },
              { label: 'Primary condition', name: 'primaryCondition', type: 'text', ph: 'e.g. Type 2 Diabetes' },
              { label: 'Location / City', name: 'location', type: 'text', ph: 'e.g. Toronto, Canada' },
            ].map(({ label, name, type, ph }) => (
              <div key={name}>
                <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>{label}</label>
                <input type={type} placeholder={ph} value={patient[name]} onChange={e => setPatient(p => ({ ...p, [name]: e.target.value }))}
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            ))}

            {/* DOB */}
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Date of birth</label>
            <input type="date" value={patient.dob} onChange={e => setPatient(p => ({ ...p, dob: e.target.value }))}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />

            {/* Secondary conditions tag input */}
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Secondary conditions</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 12px', background: 'var(--bg)', marginBottom: '16px', minHeight: '48px' }}>
              {secondaryConditions.map(c => (
                <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-light)', border: '1px solid rgba(11,138,116,0.2)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontFamily: 'Inter', fontSize: 12, color: 'var(--accent)' }}>
                  {c}
                  <button type="button" onClick={() => setSecondaryConditions(p => p.filter(x => x !== c))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
                </span>
              ))}
              <input type="text" value={condInput} onChange={e => setCondInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(condInput); } }}
                placeholder="Type and press Enter…"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)', minWidth: '120px', caretColor: 'var(--accent)' }} />
            </div>

            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Clinical notes <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <textarea value={patient.notes} onChange={e => setPatient(p => ({ ...p, notes: e.target.value }))} rows={3}
              placeholder="e.g. 65yo male, allergic to penicillin…"
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} onFocus={handleFocus} onBlur={handleBlur} />

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={() => setStep(3)}
                style={{ flex: 1, background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px', fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                Skip for now
              </button>
              <button type="submit"
                style={{ flex: 2, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '14px', fontFamily: 'Inter', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Continue →
              </button>
            </div>
          </form>
        )}

        {/* ─── STEP 3 ─────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ textAlign: 'center', animation: 'fadeUp 0.4s ease forwards' }}>
            {/* Teal circle icon */}
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid rgba(11,138,116,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4z"/><path d="M12 14c-7 0-7 3-7 3v1h14v-1s0-3-7-3z"/>
              </svg>
            </div>

            <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 32, color: 'var(--text-primary)', marginBottom: '12px' }}>
              You're all set, {currentUser?.name?.split(' ')[0] || 'Doctor'}!
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 40px' }}>
              Your Curalink account is ready. Start researching for your patients, or explore your dashboard to manage their profiles.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => navigate('/research')}
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', padding: '20px', cursor: 'pointer', fontFamily: 'Inter', fontSize: 14, fontWeight: 600, transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(11,138,116,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 24, marginBottom: '8px' }}>🔬</div>
                Start researching
              </button>
              <button onClick={() => navigate('/dashboard')}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', cursor: 'pointer', fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none'; }}>
                <div style={{ fontSize: 24, marginBottom: '8px' }}>🏠</div>
                View dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
