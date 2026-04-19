import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import useAppStore from '../../store/appStore';
import { useLocation } from 'react-router-dom';

export default function AppLayout({ children }) {
  const { fetchPatients } = useAppStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        .mobile-app-header { display: none; padding: 12px 20px; border-bottom: 1px solid var(--border); background: var(--surface); align-items: center; justify-content: space-between; z-index: 50; }
        .desktop-sidebar-wrapper { display: flex; height: 100vh; overflow: hidden; }
        
        @media (max-width: 768px) {
          .mobile-app-header { display: flex !important; }
        }
      `}</style>
      <div className="desktop-sidebar-wrapper">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Mobile visible header */}
          <div className="mobile-app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.png" alt="CuraLink Logo" style={{ width: 28, height: 28, borderRadius: '8px', objectFit: 'contain', flexShrink: 0, boxShadow: '0 2px 8px rgba(11,138,116,0.15)' }} />
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
                Curalink<span style={{ color: 'var(--accent)' }}>AI</span>
              </span>
            </div>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', fontFamily: 'Inter', fontSize: 13, fontWeight: 500 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Filter
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
