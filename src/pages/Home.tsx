import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Camera } from 'lucide-react';

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Camera className="w-16 h-16 text-primary" />
            <h1 className="text-5xl font-bold text-gray-900">Cloud Reporter</h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-gray-700 mb-12">
            AI-Powered Cloud Infrastructure Assessment Platform
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
              <p className="text-gray-600">
                AI-powered assessment generation using Gemini Vertex AI
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-semibold mb-2">File Management</h3>
              <p className="text-gray-600">
                Upload and validate assessment files with real-time status indicators
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold mb-2">Export Options</h3>
              <p className="text-gray-600">
                Generate professional DOCX, PDF reports and interactive presentations
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-4">
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <p className="text-gray-600 mb-6">
              Sign in with your Google account to start creating cloud assessments
            </p>
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
            <div>
              <button
                onClick={() => navigate('/backoffice')}
                className="mt-2 inline-flex items-center gap-2 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try BackOffice (no sign-in)
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-gray-600">
            <p>Powered by Firebase, Firestore, and Google Vertex AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
