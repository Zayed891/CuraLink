import React, { useState } from 'react';
import useAppStore from '../../store/appStore';

const CONDITIONS = [
  'Type 2 Diabetes', 'Parkinson\'s Disease', 'Alzheimer\'s Disease',
  'Hypertension', 'Chronic Kidney Disease', "Crohn's Disease",
  'Multiple Sclerosis', 'Rheumatoid Arthritis', 'COPD', 'Breast Cancer',
  'Lung Cancer', 'Atrial Fibrillation', 'Heart Failure', 'Stroke',
];

export default function AddPatientModal({ isOpen, onClose, onAdded }) {
  const { addPatient } = useAppStore();
  const [form, setForm] = useState({
    name: '', dob: '', primaryCondition: '', location: '', additionalContext: '',
  });
  const [secondaryConditions, setSecondaryConditions] = useState([]);
  const [conditionInput, setConditionInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleConditionInput = (e) => {
    const val = e.target.value;
    setConditionInput(val);
    if (val.length > 1) {
      setSuggestions(CONDITIONS.filter(c => c.toLowerCase().includes(val.toLowerCase())).slice(0, 4));
    } else {
      setSuggestions([]);
    }
  };

  const addSecondaryCondition = (val) => {
    const trimmed = val.trim();
    if (trimmed && !secondaryConditions.includes(trimmed)) {
      setSecondaryConditions(prev => [...prev, trimmed]);
    }
    setConditionInput('');
    setSuggestions([]);
  };

  const handleConditionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSecondaryCondition(conditionInput);
    }
  };

  const removeSecondary = (c) => setSecondaryConditions(prev => prev.filter(x => x !== c));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Patient name is required.';
    if (!form.primaryCondition.trim()) newErrors.primaryCondition = 'Primary condition is required.';
    if (!form.location.trim()) newErrors.location = 'Location is required.';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const patient = await addPatient({ ...form, secondaryConditions });
      if (onAdded) onAdded(patient);
      setForm({ name: '', dob: '', primaryCondition: '', location: '', additionalContext: '' });
      setSecondaryConditions([]);
      onClose();
    } catch (err) {
      console.error('Failed to save patient', err);
    }
  };

  const inputStyle = {
    width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '12px 16px',
    fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)',
    caretColor: 'var(--accent)', outline: 'none', transition: 'all var(--transition)',
    display: 'block',
  };

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; };
  const handleBlur  = (e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '36px 40px',
          maxWidth: '520px', width: '90vw', boxShadow: 'var(--shadow-lg)',
          animation: 'fadeUp 0.3s ease',
          maxHeight: '90vh', overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 26, fontWeight: 400, color: 'var(--text-primary)', marginBottom: '6px' }}>
              New Patient Profile
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)' }}>
              Add a patient to personalise your research sessions
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              background: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '16px',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0 28px' }} />

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Patient name <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Jane Smith"
              style={{ ...inputStyle, borderColor: errors.name ? 'var(--error)' : 'var(--border)' }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
            {errors.name && <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--error)', marginTop: 4 }}>{errors.name}</p>}
          </div>

          {/* DOB */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Date of birth
            </label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          {/* Primary condition */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Primary condition <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input type="text" name="primaryCondition" value={form.primaryCondition} onChange={handleChange}
              placeholder="e.g. Type 2 Diabetes"
              style={{ ...inputStyle, borderColor: errors.primaryCondition ? 'var(--error)' : 'var(--border)' }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
            {errors.primaryCondition && <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--error)', marginTop: 4 }}>{errors.primaryCondition}</p>}
          </div>

          {/* Secondary conditions — tag input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Secondary conditions
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
                border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
                padding: '8px 12px', background: 'var(--surface)', minHeight: '48px',
              }}>
                {secondaryConditions.map(c => (
                  <span key={c} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'var(--accent-light)', border: '1px solid rgba(11,138,116,0.2)',
                    borderRadius: 'var(--radius-full)', padding: '3px 10px',
                    fontFamily: 'Inter', fontSize: 12, color: 'var(--accent)',
                  }}>
                    {c}
                    <button type="button" onClick={() => removeSecondary(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
                  </span>
                ))}
                <input
                  type="text" value={conditionInput} onChange={handleConditionInput}
                  onKeyDown={handleConditionKeyDown}
                  placeholder={secondaryConditions.length === 0 ? 'Type and press Enter…' : ''}
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)', minWidth: '120px', caretColor: 'var(--accent)' }}
                />
              </div>
              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 10, marginTop: '4px' }}>
                  {suggestions.map(s => (
                    <button key={s} type="button" onClick={() => addSecondaryCondition(s)}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)', transition: 'background var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Location / City <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Toronto, Canada"
              style={{ ...inputStyle, borderColor: errors.location ? 'var(--error)' : 'var(--border)' }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
            {errors.location && <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--error)', marginTop: 4 }}>{errors.location}</p>}
          </div>

          {/* Additional Query */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Additional Query / Context <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <textarea name="additionalContext" value={form.additionalContext} onChange={handleChange} rows={3}
              placeholder="e.g. Deep Brain Stimulation, resistant to standard therapies…"
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button type="button" onClick={onClose}
              style={{
                flex: 1, background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                padding: '12px 20px', fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Cancel
            </button>
            <button type="submit"
              style={{
                flex: 2, background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: 'var(--radius-md)', padding: '12px 20px',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(11,138,116,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
