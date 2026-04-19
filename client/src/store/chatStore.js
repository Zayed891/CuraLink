import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

const useChatStore = create(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      messages: [],
      isLoading: false,
      patientContext: null,

      clear: () => {
        set({
          sessions: [],
          activeSessionId: null,
          messages: [],
          isLoading: false,
          patientContext: null,
        });
      },

      fetchSessions: async () => {
        try {
          const res = await api.get('/chat/sessions');
          if (res.data.success) {
            set({ sessions: res.data.sessions });
          }
        } catch (err) {
          console.error('[Store] fetchSessions error:', err);
        }
      },

      createSession: async (contextData) => {
        try {
          const res = await api.post('/chat/session', contextData);
          const { sessionId } = res.data;
          set((state) => ({
            sessions: [{ sessionId, ...contextData, createdAt: new Date() }, ...state.sessions],
            activeSessionId: sessionId,
            patientContext: contextData,
            messages: [],
          }));
          return sessionId;
        } catch (err) {
          console.error('[Store] createSession error:', err);
          throw err;
        }
      },

      sendMessage: async (content) => {
        const sessionId = get().activeSessionId;
        // Optimistic user message
        const tempUserMsg = { role: 'user', content, _id: `temp-${Date.now()}` };
        set((state) => ({ messages: [...state.messages, tempUserMsg], isLoading: true }));

        try {
          const res = await api.post('/chat/message', { sessionId, message: content });
          const { message } = res.data;
          set((state) => ({
            messages: [...state.messages, message],
            isLoading: false,
          }));
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      loadHistory: async (sessionId) => {
        try {
          const res = await api.get(`/chat/history/${sessionId}`);
          const session = get().sessions.find((s) => s.sessionId === sessionId);
          set({
            messages: res.data.messages,
            activeSessionId: sessionId,
            patientContext: session ? {
              name: session.name,
              disease: session.disease,
              location: session.location,
              additionalContext: session.additionalContext
            } : null
          });
        } catch (err) {
          console.error('[Store] loadHistory error:', err);
          throw err;
        }
      },
      
      setActiveSession: (sessionId) => {
        set({ activeSessionId: sessionId });
        get().loadHistory(sessionId);
      }
    }),
    { 
      name: 'curalink-store', 
      partialize: (s) => ({ sessions: s.sessions }) 
    }
  )
);

export default useChatStore;
