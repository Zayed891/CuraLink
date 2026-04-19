import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import AddPatientModal from '../components/onboarding/AddPatientModal';

const ROLES = ['Medical Officer', 'Researcher', 'Clinician', 'General Practitioner', 'Specialist', 'Other'];

const SECTIONS = ['Profile', 'Patients', 'LLM Settings', 'Notifications', 'Privacy', 'Billing'];

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 'var(--radius-full)',
        background: checked ? 'var(--accent)' : 'var(--border)',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        transition: 'background var(--transition)',
      }}
    >
      <div style={{
        position: 'absolute', top: '2px',
        left: checked ? '22px' : '2px',
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        boxShadow: 'var(--shadow-xs)',
        transition: 'left var(--transition)',
      }} />
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser, updateUser, patients, removePatient, llmSettings, updateLlmSettings, setAddPatientModalOpen, addPatientModalOpen } = useAppStore();
  const [section, setSection] = useState('Profile');
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || '',
    institution: currentUser?.institution || '',
    country: currentUser?.country || '',
    licenseNumber: currentUser?.licenseNumber || '',
  });
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const inputStyle = {
    width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '12px 16px',
    fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)',
    caretColor: 'var(--accent)', outline: 'none', transition: 'all var(--transition)',
    marginBottom: '20px', display: 'block',
  };
  const selectStyle = { ...inputStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' };
  const handleFocus = (e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; };
  const handleBlur  = (e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  const handleSave = () => {
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DR';

  return (
    <>
      <style>{`
        .settings-layout { display: flex; flex: 1; overflow: hidden; }
        .settings-nav { width: 200px; padding: 24px 12px; border-right: 1px solid var(--border); flex-shrink: 0; }
        .settings-content { flex: 1; padding: 32px 40px; overflow-y: auto; }
        .groq-api-row { display: flex; gap: 10px; }
        
        @media (max-width: 768px) {
          .settings-layout { flex-direction: column; overflow-y: auto; }
          .settings-nav { 
            width: 100%; display: flex; flex-direction: row; overflow-x: auto; 
            padding: 12px 16px; border-right: none; border-bottom: 1px solid var(--border); 
            background: var(--surface); position: sticky; top: 0; z-index: 10; gap: 8px; 
            scrollbar-width: none; 
          }
          .settings-nav::-webkit-scrollbar { display: none; }
          .settings-nav button { width: auto !important; white-space: nowrap; padding: 8px 16px !important; }
          .settings-content { padding: 24px 16px; flex: 0 0 auto; overflow-y: visible; }
          .groq-api-row { flex-direction: column; align-items: stretch; gap: 12px; }
          .groq-api-row button { width: 100%; }
        }
      `}</style>
      <div className="settings-layout">
        {/* Left nav */}
        <div className="settings-nav">
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            style={{
              width: '100%', textAlign: 'left', display: 'block',
              padding: '10px 14px', border: 'none', borderRadius: 'var(--radius-md)',
              background: section === s ? 'var(--accent-light)' : 'none',
              fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
              color: section === s ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { if (section !== s) { e.currentTarget.style.background = 'var(--bg-alt)'; } }}
            onMouseLeave={e => { if (section !== s) { e.currentTarget.style.background = 'none'; } }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Right content */}
      <div className="settings-content">

        {/* ── PROFILE ──────────────────────────────────────── */}
        {section === 'Profile' && (
          <div style={{ maxWidth: '640px' }}>
            <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)', marginBottom: '28px' }}>Profile</h2>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid rgba(11,138,116,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 24, color: 'var(--accent)' }}>
                {initials}
              </div>
              <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                Change photo
              </button>
            </div>

            {[
              { label: 'Full name', name: 'name', disabled: false },
              { label: 'Role', name: 'role', disabled: false, type: 'select', options: ROLES },
              { label: 'Institution', name: 'institution', disabled: false },
              { label: 'Country', name: 'country', disabled: false },
              { label: 'License number', name: 'licenseNumber', disabled: false },
            ].map(({ label, name, disabled, type, options }) => (
              <div key={name} style={{ position: 'relative' }}>
                <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>{label}</label>
                {type === 'select' ? (
                  <>
                    <select value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))} disabled={disabled}
                      style={{ ...selectStyle, background: disabled ? 'var(--bg-alt)' : 'var(--surface)', color: disabled ? 'var(--text-muted)' : 'var(--text-primary)' }}
                      onFocus={handleFocus} onBlur={handleBlur}>
                      <option value="">Select {label.toLowerCase()}</option>
                      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div style={{ position: 'absolute', right: 14, top: '40px', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </>
                ) : (
                  <input type="text" value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))} disabled={disabled}
                    style={{ ...inputStyle, background: disabled ? 'var(--bg-alt)' : 'var(--surface)', color: disabled ? 'var(--text-muted)' : 'var(--text-primary)' }}
                    onFocus={handleFocus} onBlur={handleBlur} />
                )}
              </div>
            ))}

            {/* Email — disabled */}
            <div>
              <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <input type="email" value={form.email} disabled style={{ ...inputStyle, paddingRight: '40px', background: 'var(--bg-alt)', color: 'var(--text-muted)', cursor: 'not-allowed' }} />
                <div style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--text-muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              </div>
            </div>

            <button onClick={handleSave} style={{
              background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
              padding: '12px 28px', fontFamily: 'Inter', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(11,138,116,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {saved ? '✓ Saved!' : 'Save changes'}
            </button>
          </div>
        )}

        {/* ── PATIENTS ─────────────────────────────────────── */}
        {section === 'Patients' && (
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)' }}>Patients</h2>
              <button onClick={() => setAddPatientModalOpen(true)}
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 18px', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-mid)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
                + Add Patient
              </button>
            </div>

            {patients.length === 0 ? (
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)' }}>No patients yet. Add your first patient above.</p>
            ) : (
              patients.map(p => (
                <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: 'var(--accent)', flexShrink: 0 }}>
                    {p.initials || '??'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-secondary)' }}>{p.primaryCondition}{p.location ? ` · ${p.location}` : ''}</div>
                  </div>
                  <button onClick={() => removePatient(p.id)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontFamily: 'Inter', fontSize: 12, color: 'var(--error)', cursor: 'pointer', transition: 'all var(--transition)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--error-bg)'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── LLM SETTINGS ─────────────────────────────────── */}
        {section === 'LLM Settings' && (
          <div style={{ maxWidth: '640px' }}>
            <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)', marginBottom: '8px' }}>LLM Settings</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)', marginBottom: '32px' }}>Configure your AI inference backend and preferences.</p>

            {[
              { key: 'useGroq', label: 'Groq API', desc: 'Use Groq\'s ultra-fast inference for LLM responses', tag: null },
              { key: 'useOllama', label: 'Ollama (local)', desc: 'Run models locally with Ollama for maximum privacy', tag: 'Local Node Only' },
              { key: 'cacheResults', label: 'Cache results (24h)', desc: 'Reuse search results to reduce API usage and latency', tag: null },
              { key: 'autoExpandQueries', label: 'Auto-expand queries', desc: 'Automatically expand short queries with medical terminology', tag: null },
            ].map(({ key, label, desc, tag }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {label}
                    {tag && (
                      <span style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
                        {tag}
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-muted)', marginTop: '3px' }}>{desc}</div>
                </div>
                <Toggle checked={llmSettings[key]} onChange={() => updateLlmSettings({ [key]: !llmSettings[key] })} />
              </div>
            ))}

            {/* Groq API key */}
            <div style={{ marginTop: '28px' }}>
              <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Groq API Key
              </label>
              <div className="groq-api-row">
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={llmSettings.groqApiKey}
                    onChange={e => updateLlmSettings({ groqApiKey: e.target.value })}
                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                    style={{ ...inputStyle, marginBottom: 0, paddingRight: '44px' }}
                    onFocus={handleFocus} onBlur={handleBlur}
                  />
                  <button type="button" onClick={() => setShowKey(!showKey)} style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showKey ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
                <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 20px', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition)', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-mid)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
                  Save Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other sections — placeholder */}
        {!['Profile', 'Patients', 'LLM Settings'].includes(section) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Instrument Serif', fontSize: 28, color: 'var(--text-muted)', marginBottom: '8px' }}>{section}</div>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)' }}>This section is coming soon.</p>
          </div>
        )}
      </div>

      <AddPatientModal isOpen={addPatientModalOpen} onClose={() => setAddPatientModalOpen(false)} />
      </div>
    </>
  );
}
