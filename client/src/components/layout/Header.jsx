import React from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import useChatStore from '../../store/chatStore';

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const { patientContext } = useChatStore();

  return (
    <header 
      className="h-[52px] flex items-center justify-between px-4 sticky top-0 z-40 glass"
    >
      <div className="flex items-center gap-3">
        {/* Mobile Toggle */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#8A8A9A] hover:text-[#F0F0F4] transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {patientContext ? (
          <div 
            className="flex items-center"
            style={{ 
              background: '#1A1A1C', 
              border: '1px solid #2A2A2F', 
              borderRadius: '99px', 
              padding: '4px 14px', 
              fontFamily: '"DM Sans", sans-serif', 
              fontSize: '12px' 
            }}
          >
            <span 
              className="mr-[8px]"
              style={{
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: '#3B9EFF', 
                boxShadow: '0 0 8px rgba(59,158,255,0.8)',
                animation: 'pulseDot 2s infinite'
              }} 
            />
            <span className="font-medium text-[#F0F0F4] truncate max-w-[120px] sm:max-w-none">
              {patientContext.disease}
            </span>
            {patientContext.name && (
              <>
                <span className="mx-[6px] text-[#55556A] hidden sm:inline">•</span>
                <span className="text-[#8A8A9A] hidden sm:inline italic">{patientContext.name}</span>
              </>
            )}
            {patientContext.location && (
              <>
                <span className="mx-[6px] text-[#55556A] hidden md:inline">•</span>
                <span className="text-[#55556A] hidden md:inline">{patientContext.location}</span>
              </>
            )}
          </div>
        ) : (
          <div className="text-[12px] font-medium text-[#55556A] px-2 italic">
            Select patient context to begin
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div 
          className="hidden sm:flex items-center gap-1.5"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '9px',
            color: '#55556A',
            border: '1px solid #1E1E24',
            borderRadius: '4px',
            padding: '2px 8px',
            letterSpacing: '0.05em'
          }}
        >
          <ShieldCheck size={12} className="text-[#3B9EFF] opacity-70" />
          HIPAA COMPLIANT
        </div>
      </div>
    </header>
  );
}

