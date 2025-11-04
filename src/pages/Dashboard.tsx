import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAssessments, getDashboardStats } from '../services/assessmentService';
import { getClients } from '../services/clientService';
import type { Assessment, Client } from '../types';
import { formatDate, getStatusColor, cn } from '../utils/helpers';
import { FileText, Users, Clock, Plus, LogOut, Camera } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({ totalAssessments: 0, inProgress: 0, completed: 0, ready: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [assessmentsData, clientsData, statsData] = await Promise.all([
        getAssessments(user.uid),
        getClients(user.uid),
        getDashboardStats(user.uid),
      ]);

      setAssessments(assessmentsData.slice(0, 5)); // Show only recent 5
      setClients(clientsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">Cloud Reporter</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Assessment Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage your cloud assessment projects and track progress</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/clients/new')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Client
            </button>
            <button
              onClick={() => navigate('/assessments/new')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Assessment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Assessments</h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold">{stats.totalAssessments}</p>
            <p className="text-xs text-gray-500 mt-1">Active assessment projects</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Clients</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold">{clients.length}</p>
            <p className="text-xs text-gray-500 mt-1">Organizations being assessed</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold">{stats.inProgress}</p>
            <p className="text-xs text-gray-500 mt-1">Assessments currently active</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold">{stats.completed}</p>
            <p className="text-xs text-gray-500 mt-1">Finished assessments</p>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Assessments</h3>
            <p className="text-sm text-gray-600 mt-1">Your most recently updated assessment projects</p>
          </div>

          {assessments.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h4>
              <p className="text-gray-600 mb-6">Create your first assessment to get started</p>
              <button
                onClick={() => navigate('/assessments/new')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Your First Assessment
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {assessments.map((assessment) => {
                const client = clients.find(c => c.id === assessment.clientId);
                return (
                  <div
                    key={assessment.id}
                    onClick={() => navigate(`/assessments/${assessment.id}`)}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{assessment.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Client: {client?.name || 'Unknown'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Created {formatDate(assessment.createdAt)}</span>
                          {assessment.deadline && (
                            <span>Due {formatDate(assessment.deadline)}</span>
                          )}
                          <span>{assessment.readinessPercentage}% ready</span>
                        </div>
                      </div>
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        getStatusColor(assessment.status)
                      )}>
                        {assessment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
