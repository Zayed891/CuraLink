import React, { useState } from 'react';

// This is kept for backward compatibility — used by the old MainLayout.
// The main modal used in the new UI is AddPatientModal.
export default function ContextModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({ name: '', disease: '', location: '', additionalContext: '' });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.disease.trim()) {
      setErrors({ disease: 'Disease or condition is required.' });
      return;
    }
    onSubmit(formData);
  };

  const inputStyle = {
    width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '12px 16px',
    fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)',
    caretColor: 'var(--accent)', outline: 'none', transition: 'all var(--transition)',
    display: 'block',
  };
  const handleFocus = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; };
  const handleBlur  = e => { e.target.style.borderColor = errors[e.target.name] ? 'var(--error)' : 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeIn 0.2s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px 40px', maxWidth: '480px', width: '90vw', boxShadow: 'var(--shadow-lg)', animation: 'fadeUp 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 26, fontWeight: 400, color: 'var(--text-primary)' }}>New Research Session</h2>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Disease / Condition', name: 'disease', required: true, ph: "e.g. Type 2 Diabetes, Parkinson's…" },
            { label: 'Patient Name', name: 'name', required: false, ph: 'e.g. John Smith (optional)' },
            { label: 'Location', name: 'location', required: false, ph: 'e.g. Toronto, Canada (for trials)' },
          ].map(({ label, name, required, ph }) => (
            <div key={name} style={{ marginBottom: '16px' }}>
              <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
              </label>
              <input type="text" name={name} value={formData[name]} onChange={handleChange} placeholder={ph}
                style={{ ...inputStyle, borderColor: errors[name] ? 'var(--error)' : 'var(--border)' }}
                onFocus={handleFocus} onBlur={handleBlur} disabled={isSubmitting} />
              {errors[name] && <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--error)', marginTop: 4 }}>{errors[name]}</p>}
            </div>
          ))}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Additional Context <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <textarea name="additionalContext" value={formData.additionalContext} onChange={handleChange} rows={3}
              placeholder="e.g. 65yo male, allergic to penicillin…"
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} onFocus={handleFocus} onBlur={handleBlur} disabled={isSubmitting} />
          </div>

          <button type="submit" disabled={isSubmitting}
            style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '14px', fontFamily: 'Inter', fontSize: 15, fontWeight: 600, cursor: isSubmitting ? 'wait' : 'pointer', transition: 'all var(--transition)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            {isSubmitting ? (
              <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinLoader 0.8s linear infinite' }} /> Starting…</>
            ) : 'Start Research Session'}
          </button>
        </form>
      </div>
    </div>
  );
}
