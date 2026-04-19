import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 90000, // 90s — allow for cold-start LLM inference + retrieval
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token from appStore ──────────────
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('curalink-app-store');
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch {
    // silently ignore — server will return 500 and chatStore will handle it
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const data = err.response?.data;
    console.error(`[API Error] ${status || 'Network'} —`, data?.error || err.message);
    return Promise.reject(err);
  }
);

export default api;
