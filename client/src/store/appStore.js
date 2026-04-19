import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useChatStore from './chatStore';
import api from '../lib/api';

const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────────
      // ── Patient–Session map ────────────────────────────
      // maps patientId → sessionId so each patient has their own chat
      patientSessionMap: {},

      getPatientSessionId: (patientId) => {
        return useAppStore.getState().patientSessionMap[patientId] || null;
      },

      bindSessionToPatient: (patientId, sessionId) => {
        set((state) => ({
          patientSessionMap: { ...state.patientSessionMap, [patientId]: sessionId },
        }));
      },

      // ── Auth ──────────────────────────────────────────────────
      currentUser: null, // null = logged out
      token: null,

      login: (userData, token) => {
        set({
          currentUser: userData,
          token: token,
        });
        useAppStore.getState().fetchPatients();
      },

      logout: () => {
        set({
          currentUser: null,
          token: null,
          patients: [],
          activePatient: null,
          // Intentionally preserving patientSessionMap so sessions aren't lost upon relogin
        });
        useChatStore.getState().clear();
      },

      updateUser: (updates) => {
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
        }));
      },

      // ── Patients ──────────────────────────────────────────────
      patients: [],
      activePatient: null,

      fetchPatients: async () => {
        try {
          const res = await api.get('/patients');
          if (res.data.success) {
            set({ patients: res.data.patients });
          }
        } catch (err) {
          console.error('[AppStore] fetchPatients error:', err);
        }
      },

      addPatient: async (patientData) => {
        try {
          const res = await api.post('/patients', patientData);
          if (res.data.success) {
            const newPatient = res.data.patient;
            set((state) => ({
              patients: [newPatient, ...state.patients],
              activePatient: newPatient,
            }));
            return newPatient;
          }
        } catch (err) {
          console.error('[AppStore] addPatient error:', err);
          throw err;
        }
      },

      updatePatient: async (id, updates) => {
        try {
          const res = await api.put(`/patients/${id}`, updates);
          if (res.data.success) {
            set((state) => ({
              patients: state.patients.map((p) =>
                p.id === id ? { ...p, ...res.data.patient } : p
              ),
            }));
          }
        } catch (err) {
          console.error('[AppStore] updatePatient error:', err);
        }
      },

      removePatient: async (id) => {
        try {
          const res = await api.delete(`/patients/${id}`);
          if (res.data.success) {
            set((state) => ({
              patients: state.patients.filter((p) => p.id !== id),
              activePatient: state.activePatient?.id === id ? null : state.activePatient,
            }));
          }
        } catch (err) {
          console.error('[AppStore] removePatient error:', err);
        }
      },

      setActivePatient: (patient) => {
        set({ activePatient: patient });
      },

      // ── LLM Settings ─────────────────────────────────────────
      llmSettings: {
        useGroq: true,
        useOllama: false,
        cacheResults: true,
        autoExpandQueries: true,
        groqApiKey: '',
      },

      updateLlmSettings: (updates) => {
        set((state) => ({
          llmSettings: { ...state.llmSettings, ...updates },
        }));
      },

      // ── UI State ─────────────────────────────────────────────
      addPatientModalOpen: false,
      setAddPatientModalOpen: (open) => set({ addPatientModalOpen: open }),
    }),
    {
      name: 'curalink-app-store',
      partialize: (s) => ({
        currentUser: s.currentUser,
        token: s.token,
        patients: s.patients,
        activePatient: s.activePatient,
        llmSettings: s.llmSettings,
        patientSessionMap: s.patientSessionMap,
      }),
    }
  )
);

export default useAppStore;
