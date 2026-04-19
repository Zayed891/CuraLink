import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../store/chatStore';
import ContextModal from '../components/onboarding/ContextModal';
import { Hexagon } from 'lucide-react';
import Button from '../components/ui/Button';

export default function HomePage() {
  const { activeSessionId, createSession } = useChatStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (activeSessionId) {
      navigate('/chat', { replace: true });
    }
  }, [activeSessionId, navigate]);

  const handleCreateSession = async (data) => {
    setIsCreating(true);
    try {
      await createSession(data);
      setIsModalOpen(false);
      navigate('/chat');
    } catch (err) {
      console.error('Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="z-10 bg-[var(--color-surface)] border border-[var(--color-border)] p-10 rounded-2xl shadow-md max-w-lg w-full">
        <Hexagon className="w-12 h-12 text-[var(--color-accent)] fill-[var(--color-accent-dim)] mx-auto mb-6" />
        <h1 className="text-3xl font-display font-semibold mb-4 text-[var(--color-text-primary)]">
          Welcome to Curalink
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Your AI medical research assistant. We synthesize data from PubMed, OpenAlex, and ClinicalTrials.gov to provide evidence-based insights for your patients.
        </p>
        
        <Button 
          size="lg" 
          className="w-full shadow-glow"
          onClick={() => setIsModalOpen(true)}
        >
          Start a New Research Session
        </Button>
      </div>

      <ContextModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateSession}
        isSubmitting={isCreating}
      />
    </div>
  );
}
