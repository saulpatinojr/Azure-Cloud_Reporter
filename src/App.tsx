import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientForm from './pages/ClientForm';
import BackOfficeDemo from './pages/BackOfficeDemo';
import Templates from './pages/Templates';
import TemplateBuilder from './pages/TemplateBuilder';
import { ComingSoon } from './pages/ComingSoon';
import UploadCenter from './pages/UploadCenter';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/new"
        element={
          <ProtectedRoute>
            <ClientForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id/edit"
        element={
          <ProtectedRoute>
            <ClientForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessments"
        element={
          <ProtectedRoute>
            <ComingSoon
              title="Assessment library"
              description="Manage drafts, approvals, and final deliverables in one command center."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/new"
        element={
          <ProtectedRoute>
            <ComingSoon
              title="New template"
              description="Template creation workflow is coming soon. Duplicate an existing template to get started."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/:id"
        element={
          <ProtectedRoute>
            <TemplateBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <ComingSoon
              title="Insights & benchmarks"
              description="Portfolio trends, risk heatmaps, and cost optimization intelligence are coming soon."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/automation"
        element={
          <ProtectedRoute>
            <ComingSoon
              title="Automation studio"
              description="Design AI workflows, triggers, and escalation rules to accelerate delivery."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ComingSoon
              title="Organization settings"
              description="Manage teams, permissions, billing, and integrations in one place."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/uploads"
        element={
          <ProtectedRoute>
            <UploadCenter />
          </ProtectedRoute>
        }
      />
      {/* More routes will be added here */}
      <Route path="/backoffice" element={<BackOfficeDemo />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
