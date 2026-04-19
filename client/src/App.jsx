import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from './store/appStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ResearchPage from './pages/ResearchPage';
import ArchivePage from './pages/ArchivePage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

// Layout
import AppLayout from './components/layout/AppLayout';

// Route guard — redirects to /login if not authenticated
function PrivateRoute({ children }) {
  const currentUser = useAppStore((s) => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

// Route guard — redirects logged-in users away from auth pages
function PublicOnlyRoute({ children }) {
  const currentUser = useAppStore((s) => s.currentUser);
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />

        {/* Auth required — onboarding (no sidebar) */}
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              <OnboardingPage />
            </PrivateRoute>
          }
        />

        {/* Auth required — app layout with sidebar */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/research"
          element={
            <PrivateRoute>
              <AppLayout>
                <ResearchPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <PrivateRoute>
              <AppLayout>
                <ArchivePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* Legacy /chat redirect → /research */}
        <Route path="/chat" element={<Navigate to="/research" replace />} />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
