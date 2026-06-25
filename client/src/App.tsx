import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Education from './pages/Education';
import Certificates from './pages/Certificates';
import CV from './pages/CV';

// Authentication Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/Admin/DashboardPage';
import ProjectsPage from './pages/Admin/ProjectsPage';
import EducationPage from './pages/Admin/EducationPage';
import CertificatesPage from './pages/Admin/CertificatesPage';
import AboutPage from './pages/Admin/AboutPage';
import CVPage from './pages/Admin/CVPage';
import SettingsPage from './pages/Admin/SettingsPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes standard stale time
    },
  },
});

// Public Layout Wrapper with standard site Navbar & Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar />
      {/* Adding space for fixed navigation bar */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PortfolioProvider>
            <Router>
              {/* Global Alert Notification Toaster */}
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-3 rounded-lg',
                  duration: 4000,
                }}
              />

            <Routes>
              {/* A. Public Portfolio Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/education" element={<Education />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/cv" element={<CV />} />
                
                {/* Auth endpoints */}
                <Route path="/manoj-admin-login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              {/* B. Protected Admin Control Board */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                {/* Direct index redirect to dashboard */}
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="education" element={<EducationPage />} />
                <Route path="certificates" element={<CertificatesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="cv" element={<CVPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* C. Fallback Direct */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Router>
          </PortfolioProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
