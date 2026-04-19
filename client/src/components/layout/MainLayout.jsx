import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ContextModal from '../onboarding/ContextModal';
import useChatStore from '../../store/chatStore';

export default function MainLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { createSession } = useChatStore();
  const [isCreating, setIsCreating] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNewSession = () => {
    setIsModalOpen(true);
  };

  const handleCreateSession = async (data) => {
    setIsCreating(true);
    try {
      await createSession(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar with mobile transition */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onNewSession={handleNewSession} onClose={closeSidebar} />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 border-l border-[var(--color-border)] relative overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-0 relative">
          {children}
        </div>
      </main>

      <ContextModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateSession}
        isSubmitting={isCreating}
      />
    </div>
  );
}
