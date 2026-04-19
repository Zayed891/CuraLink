import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAppStore from '../../store/appStore';

export default function Navbar() {
  const { currentUser, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/research',  label: 'Research' },
    { path: '/archive',   label: 'Archive' },
    { path: '/settings',  label: 'Settings' },
  ];

  const landingLinks = [
    { id: 'data-sources', label: 'Data Sources' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'features', label: 'Features' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleScroll = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <style>{`
        .desktop-nav { display: flex; }
        .desktop-auth { display: flex; }
        .mobile-toggle { display: none; background: none; border: none; padding: 6px; color: var(--text-primary); cursor: pointer; }
        .mobile-panel {
          position: absolute; top: 100%; left: 0; right: 0;
          background: var(--surface); border-bottom: 1px solid var(--border);
          padding: 16px 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          display: flex; flexDirection: column; gap: 16px;
          animation: slideDown 0.2s ease forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
      <header style={{
        height: '58px',
        background: 'rgba(247,248,246,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
      }}>
      {/* LEFT — Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.png" alt="CuraLink Logo" style={{ width: 32, height: 32, borderRadius: '10px', objectFit: 'contain', flexShrink: 0, boxShadow: '0 2px 8px rgba(11,138,116,0.15)' }} />
        <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
          Curalink
          <span style={{ color: 'var(--accent)' }}>AI</span>
        </span>
      </Link>

      {/* CENTER — Nav links */}
      {currentUser ? (
        <nav className="desktop-nav" style={{ alignItems: 'center', gap: '4px' }}>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: 500,
                color: isActive(path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                position: 'relative',
                transition: 'color var(--transition)',
              }}
            >
              {label}
              {isActive(path) && (
                <span style={{
                  position: 'absolute',
                  bottom: -1,
                  left: '14px',
                  right: '14px',
                  height: '2px',
                  background: 'var(--accent)',
                  borderRadius: '99px',
                }} />
              )}
            </Link>
          ))}
        </nav>
      ) : (
        <nav className="desktop-nav" style={{ alignItems: 'center', gap: '24px' }}>
          {landingLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleScroll(e, id)}
              style={{
                fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
                color: 'var(--text-secondary)', textDecoration: 'none',
                transition: 'color var(--transition)'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {label}
            </a>
          ))}
        </nav>
      )}

      {/* RIGHT */}
      {currentUser ? (
        <div className="desktop-auth" style={{ alignItems: 'center', gap: '12px' }}>
          {/* Bell */}
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '6px',
            borderRadius: 'var(--radius-sm)',
            transition: 'color var(--transition)',
            display: 'flex', alignItems: 'center',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>

          {/* Avatar + dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: 34, height: 34,
                background: 'var(--accent-light)',
                border: '1.5px solid rgba(11,138,116,0.2)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: 'var(--accent)',
                transition: 'box-shadow var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {currentUser.avatar || 'DR'}
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '6px',
                boxShadow: 'var(--shadow-lg)', minWidth: '160px',
                animation: 'fadeUp 0.15s ease forwards',
              }}>
                <div style={{
                  padding: '10px 12px 8px',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: '6px',
                }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {currentUser.role}
                  </div>
                </div>
                {[
                  { label: 'Profile', path: '/settings' },
                  { label: 'Settings', path: '/settings' },
                ].map(({ label, path }) => (
                  <Link
                    key={label}
                    to={path}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'block', padding: '8px 12px',
                      fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)',
                      textDecoration: 'none', borderRadius: 'var(--radius-sm)',
                      transition: 'background var(--transition), color var(--transition)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-alt)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', background: 'none', border: 'none',
                    fontFamily: 'Inter', fontSize: 13, color: 'var(--error)',
                    cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                    transition: 'background var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--error-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="desktop-auth" style={{ alignItems: 'center', gap: '10px' }}>
          <Link
            to="/login"
            style={{
              fontFamily: 'Inter', fontWeight: 500, fontSize: 14,
              color: 'var(--text-secondary)', textDecoration: 'none',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-full)',
              padding: '8px 20px',
              transition: 'border-color var(--transition), color var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
              color: '#fff', textDecoration: 'none',
              background: 'var(--accent)', borderRadius: 'var(--radius-full)',
              padding: '8px 20px',
              transition: 'background var(--transition), box-shadow var(--transition), transform var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-mid)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(11,138,116,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get Started
          </Link>
        </div>
      )}

      {/* Mobile Toggle Button */}
      <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {mobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </>
          ) : (
            <>
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Menu Slide Down */}
      {mobileMenuOpen && (
        <div className="mobile-panel" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', border: '1px solid var(--border)', borderTop: 'none' }}>
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {navLinks.map(({ path, label }) => (
                <Link key={path} to={path} style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: isActive(path) ? 'var(--bg-alt)' : 'transparent' }}>
                  {label}
                </Link>
              ))}
              <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
              <Link to="/settings" style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', padding: '10px 14px' }}>
                Profile
              </Link>
              <button onClick={handleLogout} style={{ textAlign: 'left', fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'var(--error)', background: 'none', border: 'none', padding: '10px 14px', cursor: 'pointer' }}>
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {landingLinks.map(({ id, label }) => (
                <a key={id} href={`#${id}`} onClick={(e) => { handleScroll(e, id); setMobileMenuOpen(false); }} style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', padding: '10px 14px' }}>
                  {label}
                </a>
              ))}
              <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 10px' }}>
                <Link to="/login" style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '12px' }}>
                  Sign in
                </Link>
                <Link to="/signup" style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: '#fff', background: 'var(--accent)', textDecoration: 'none', textAlign: 'center', padding: '12px', borderRadius: 'var(--radius-full)' }}>
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
    </>
  );
}
