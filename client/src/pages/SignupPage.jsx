import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';
import api from '../lib/api';

const FEATURES = [
  'AI-synthesized clinical evidence',
  'Zero hallucinations — all sources cited',
  'PubMed · OpenAlex · ClinicalTrials.gov',
];

const ROLES = ['Medical Officer', 'Researcher', 'Clinician', 'General Practitioner', 'Specialist', 'Other'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Medical Officer' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      
      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Responsive styles ─────────────────────────────── */}
      <style>{`
        .auth-page {
          display: flex;
          min-height: 100vh;
        }
        .auth-left {
          width: 38%;
          flex-shrink: 0;
          background: #0F1A17;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .auth-left-grid {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image:
            linear-gradient(#1E3530 1px, transparent 1px),
            linear-gradient(90deg, #1E3530 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 48px 40px;
          overflow-y: auto;
        }
        .auth-form-card {
          width: 100%;
          max-width: 420px;
        }
        .auth-field {
          width: 100%;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: var(--text-primary);
          caret-color: var(--accent);
          outline: none;
          transition: border-color var(--transition), box-shadow var(--transition);
          display: block;
          box-sizing: border-box;
        }
        .auth-field:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        .auth-field::placeholder { color: var(--text-muted); }
        .auth-logo-top {
          position: absolute;
          top: 36px;
          left: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1;
        }
        .auth-mobile-logo { display: none; }

        /* ── Mobile ─────────────────────────────────────── */
        @media (max-width: 768px) {
          .auth-page { flex-direction: column; }
          .auth-left { display: none; }
          .auth-right {
            padding: 36px 20px;
            align-items: flex-start;
          }
          .auth-form-card { max-width: 100%; }
          .auth-mobile-logo { display: flex !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .auth-left { width: 36%; padding: 32px; }
          .auth-right { padding: 40px 28px; }
        }
      `}</style>

      <div className="auth-page">
        {/* LEFT — Brand panel */}
        <div className="auth-left">
          <div className="auth-left-grid" />

          {/* Logo */}
          <div className="auth-logo-top">
            <img src="/logo.png" alt="CuraLink Logo" style={{ width: 32, height: 32, borderRadius: '8px', objectFit: 'contain', flexShrink: 0, background: '#fff', padding: '2px' }} />
            <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>CuralinkAI</span>
          </div>

          {/* Quote */}
          <p style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 'clamp(22px, 2.5vw, 30px)', color: '#fff', lineHeight: 1.45, marginBottom: 44, position: 'relative', zIndex: 1 }}>
            "Join thousands of clinicians researching smarter."
          </p>

          {/* Feature bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 1 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="auth-right">
          <div className="auth-form-card" style={{ animation: 'fadeUp 0.4s ease forwards' }}>

            <div style={{ marginBottom: 24 }}>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back to Home
              </Link>
            </div>

            {/* Mobile-only logo */}
            <div className="auth-mobile-logo" style={{ alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <img src="/logo.png" alt="CuraLink Logo" style={{ width: 30, height: 30, borderRadius: '8px', objectFit: 'contain', background: '#fff', padding: '2px', flexShrink: 0, boxShadow: '0 2px 8px rgba(11,138,116,0.15)' }} />
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                Curalink<span style={{ color: 'var(--accent)' }}>AI</span>
              </span>
            </div>

            <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: 6 }}>
              Create your account
            </h1>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 28 }}>
              Join Curalink — free to start, no credit card required
            </p>

            {error && (
              <div style={{ background: 'var(--error-bg)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20, fontFamily: 'Inter', fontSize: 13, color: 'var(--error)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {[
                { label: 'Full name', name: 'name', type: 'text', placeholder: 'Dr. Jane Smith', required: true },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'you@hospital.com', required: true },
                { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 8 characters', required: true },
                { label: 'Confirm password', name: 'confirm', type: 'password', placeholder: '••••••••', required: true },
              ].map(({ label, name, type, placeholder, required }) => (
                <div key={name} style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
                  </label>
                  <input
                    className="auth-field"
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                  />
                </div>
              ))}

              {/* Role select */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Role
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="auth-field"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: 36, cursor: 'pointer' }}
                  >
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', background: 'var(--accent)', color: '#fff',
                  borderRadius: 'var(--radius-md)', padding: '14px',
                  fontFamily: 'Inter', fontSize: 15, fontWeight: 600,
                  border: 'none', cursor: loading ? 'wait' : 'pointer',
                  transition: 'all var(--transition)', marginBottom: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(11,138,116,0.35)'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinLoader 0.8s linear infinite' }} />
                    Creating account…
                  </>
                ) : 'Create account →'}
              </button>

              <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
                By signing up you agree to our Terms and Privacy Policy
              </p>
            </form>

            <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
