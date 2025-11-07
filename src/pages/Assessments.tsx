import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAssessments } from '../services/assessmentService';
import { getClients } from '../services/clientService';
import type { Assessment, Client } from '../types';
import { formatDate, cn } from '../utils/helpers';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, Badge } from '../design-system';
import { 
  Plus, Search, Filter, MoreVertical, 
  Clock, FileText, Download, Eye, Edit,
  BarChart3, Users, Calendar, Target
} from 'lucide-react';

// Use the Assessment type from the types file for status
type AssessmentPriority = 'low' | 'medium' | 'high' | 'critical';

// Extended Assessment type for enterprise features
interface EnterpriseAssessment extends Assessment {
  priority: AssessmentPriority;
  estimatedValue: number;
  actualValue?: number;
  team: string[];
  tags: string[];
  progress: {
    discovery: number;
    analysis: number;
    recommendations: number;
    deliverables: number;
  };
  files: {
    id: string;
    name: string;
    type: 'pdf' | 'png' | 'jpg' | 'csv' | 'txt';
    size: number;
    uploadedAt: Date;
    status: 'uploaded' | 'processing' | 'analyzed' | 'error';
  }[];
}

const statusColors: Record<Assessment['status'], string> = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  ready: 'bg-yellow-100 text-yellow-800',
  generating: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  planning: 'bg-indigo-100 text-indigo-800',
  discovery: 'bg-cyan-100 text-cyan-800',
  analysis: 'bg-purple-100 text-purple-800',
  review: 'bg-orange-100 text-orange-800',
  archived: 'bg-gray-100 text-gray-600'
};

const priorityColors: Record<AssessmentPriority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

export default function Assessments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<EnterpriseAssessment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Assessment['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<AssessmentPriority | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      if (user) {
        const [assessmentsData, clientsData] = await Promise.all([
          getAssessments(user.uid),
          getClients(user.uid)
        ]);
        // Transform to enterprise assessments with mock extended data
        const enterpriseAssessments: EnterpriseAssessment[] = assessmentsData.map((assessment, index) => ({
          ...assessment,
          priority: ['low', 'medium', 'high', 'critical'][index % 4] as AssessmentPriority,
          estimatedValue: 50000 + (index * 25000),
          actualValue: index < 2 ? 75000 + (index * 30000) : undefined,
          team: ['john.doe@company.com', 'jane.smith@company.com'].slice(0, (index % 3) + 1),
          tags: ['Azure', 'Security', 'Cost Optimization', 'Migration'].slice(0, (index % 4) + 1),
          progress: {
            discovery: Math.min(100, 20 + (index * 15)),
            analysis: Math.min(100, 10 + (index * 12)),
            recommendations: Math.min(100, 5 + (index * 8)),
            deliverables: Math.min(100, index * 10)
          },
          files: [
            {
              id: `file-${index}-1`,
              name: 'azure-inventory.csv',
              type: 'csv',
              size: 2048576,
              uploadedAt: new Date(Date.now() - (index * 86400000)),
              status: 'analyzed'
            },
            {
              id: `file-${index}-2`,
              name: 'network-diagram.png',
              type: 'png',
              size: 1024000,
              uploadedAt: new Date(Date.now() - (index * 43200000)),
              status: 'uploaded'
            }
          ]
        }));
        setAssessments(enterpriseAssessments);
        setClients(clientsData);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesSearch = assessment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           assessment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || assessment.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [assessments, searchQuery, statusFilter, priorityFilter]);

  const handleCreateAssessment = () => {
    navigate('/assessments/new');
  };

  const handleViewAssessment = (id: string) => {
    navigate(`/assessments/${id}`);
  };

  const quickActions = (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="primary" size="md" onClick={handleCreateAssessment}>
        <Plus className="h-4 w-4 mr-2" />
        New Assessment
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-sm text-text-secondary">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Assessment Management"
      subtitle="End-to-end cloud assessment lifecycle management"
      actions={quickActions}
      userEmail={user?.email ?? null}
    >
      <div className="space-y-6">
        {/* Analytics Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Assessments</p>
                <p className="text-2xl font-semibold text-text">{assessments.length}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">In Progress</p>
                <p className="text-2xl font-semibold text-text">
                  {assessments.filter(a => !['completed', 'archived'].includes(a.status)).length}
                </p>
              </div>
              <div className="rounded-full bg-warning/10 p-2">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Value</p>
                <p className="text-2xl font-semibold text-text">
                  ${assessments.reduce((sum, a) => sum + a.estimatedValue, 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-full bg-success/10 p-2">
                <Target className="h-5 w-5 text-success" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Team Members</p>
                <p className="text-2xl font-semibold text-text">
                  {new Set(assessments.flatMap(a => a.team)).size}
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  type="search"
                  placeholder="Search assessments, clients, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Assessment['status'] | 'all')}
                className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="planning">Planning</option>
                <option value="discovery">Discovery</option>
                <option value="analysis">Analysis</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as AssessmentPriority | 'all')}
                className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'text-text-secondary hover:text-text hover:bg-surface'
                )}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'table' 
                    ? 'bg-primary text-white' 
                    : 'text-text-secondary hover:text-text hover:bg-surface'
                )}
              >
                <FileText className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* Assessments Grid */}
        {viewMode === 'grid' ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAssessments.map((assessment) => {
              const client = clients.find(c => c.id === assessment.clientId);
              return (
                <Card key={assessment.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text truncate">{assessment.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">{client?.name || 'Unknown Client'}</p>
                      </div>
                      <button className="p-1 rounded-lg hover:bg-surface text-text-secondary">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusColors[assessment.status]}>
                        {assessment.status}
                      </Badge>
                      <Badge variant="outline" className={priorityColors[assessment.priority]}>
                        {assessment.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Overall Progress</span>
                        <span className="text-text">{assessment.readinessPercentage}%</span>
                      </div>
                      <div className="w-full bg-surface rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${assessment.readinessPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-secondary">Estimated Value</p>
                        <p className="font-medium text-text">${assessment.estimatedValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary">Files</p>
                        <p className="font-medium text-text">{assessment.files.length} uploaded</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-text-secondary" />
                        <span className="text-sm text-text-secondary">
                          Due {assessment.deadline ? formatDate(assessment.deadline) : 'TBD'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewAssessment(assessment.id)}
                          className="p-2 rounded-lg hover:bg-surface text-text-secondary hover:text-text"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-surface text-text-secondary hover:text-text">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          // Table view would go here
          <Card className="p-6">
            <p className="text-text-secondary">Table view implementation coming soon...</p>
          </Card>
        )}

        {filteredAssessments.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-text-secondary mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">No assessments found</h3>
            <p className="text-text-secondary mb-6">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first assessment'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
              <Button onClick={handleCreateAssessment} variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Create First Assessment
              </Button>
            )}
          </Card>
        )}
      </div>
    </AppShell>
  );
}