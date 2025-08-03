import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

// Layout Components
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Auth Components
import LoginPage from '@/components/auth/LoginPage';
import SignUpPage from '@/components/auth/SignUpPage';

// Main Pages
import Dashboard from '@/pages/Dashboard';
import MagicPages from '@/pages/MagicPages';
import VideoCreator from '@/pages/VideoCreator';
import WhatsAppMarketing from '@/pages/WhatsAppMarketing';
import FacebookAds from '@/pages/FacebookAds';
import DropshippingHub from '@/pages/DropshippingHub';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import NexBrainChat from '@/pages/NexBrainChat';
import AdminDashboard from '@/pages/AdminDashboard';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Main App Layout
function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// App Content (inside providers)
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" replace /> : <SignUpPage />} 
        />

        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/magic-pages"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MagicPages />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-creator"
          element={
            <ProtectedRoute>
              <AppLayout>
                <VideoCreator />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/whatsapp"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WhatsAppMarketing />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/facebook-ads"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FacebookAds />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dropshipping"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DropshippingHub />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nexbrain"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NexBrainChat />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

// Main App Component with Providers
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          richColors
          closeButton
          className="toaster"
        />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;