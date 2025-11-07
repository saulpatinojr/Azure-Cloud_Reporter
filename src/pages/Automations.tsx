import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, CardHeader } from '../design-system';
import { 
  Play, Pause, Plus, Edit3, Trash2, Copy, Clock, 
  AlertCircle, CheckCircle2, XCircle, Timer,
  FileText, BarChart3, Target, GitBranch,
  Bell, Search,
  Activity, Workflow
} from 'lucide-react';

// Enterprise automation types
interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  lastRun: Date | null;
  runCount: number;
  successRate: number;
  category: 'assessment' | 'notification' | 'escalation' | 'reporting' | 'integration';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdAt: Date;
  tags: string[];
}

interface AutomationTrigger {
  type: 'schedule' | 'event' | 'condition' | 'manual';
  schedule?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time: string;
    days?: string[];
  };
  event?: {
    source: 'assessment' | 'client' | 'team' | 'file' | 'system';
    action: string;
  };
  condition?: {
    field: string;
    operator: string;
    value: any;
  };
}

interface AutomationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

interface AutomationAction {
  id: string;
  type: 'email' | 'slack' | 'teams' | 'create_task' | 'update_status' | 'generate_report' | 'api_call';
  config: Record<string, any>;
  delay?: number;
}

interface AutomationExecution {
  id: string;
  automationId: string;
  startTime: Date;
  endTime: Date | null;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  result?: any;
  error?: string;
  logs: string[];
}

export default function Automations() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    loadAutomations();
    loadExecutions();
  }, [user]);

  const loadAutomations = async () => {
    try {
      // In a real implementation, this would fetch from Firestore
      const demoAutomations: AutomationRule[] = [
        {
          id: '1',
          name: 'Assessment Overdue Alert',
          description: 'Send escalation emails when assessments exceed deadline by 3 days',
          isActive: true,
          trigger: {
            type: 'schedule',
            schedule: { frequency: 'daily', time: '09:00' }
          },
          conditions: [
            {
              id: 'c1',
              field: 'assessment.status',
              operator: 'equals',
              value: 'in-progress'
            },
            {
              id: 'c2',
              field: 'assessment.daysOverdue',
              operator: 'greater_than',
              value: 3,
              logicalOperator: 'AND'
            }
          ],
          actions: [
            {
              id: 'a1',
              type: 'email',
              config: {
                to: 'manager@company.com',
                template: 'overdue-assessment',
                priority: 'high'
              }
            }
          ],
          lastRun: new Date('2024-01-15T09:00:00'),
          runCount: 47,
          successRate: 97.8,
          category: 'escalation',
          priority: 'high',
          createdBy: 'sarah.chen@company.com',
          createdAt: new Date('2024-01-01'),
          tags: ['assessments', 'deadlines', 'notifications']
        },
        {
          id: '2',
          name: 'Weekly Performance Report',
          description: 'Generate and distribute weekly team performance analytics',
          isActive: true,
          trigger: {
            type: 'schedule',
            schedule: { frequency: 'weekly', time: '08:00', days: ['monday'] }
          },
          conditions: [],
          actions: [
            {
              id: 'a1',
              type: 'generate_report',
              config: {
                type: 'team-performance',
                format: 'pdf',
                recipients: ['leadership@company.com']
              }
            }
          ],
          lastRun: new Date('2024-01-15T08:00:00'),
          runCount: 12,
          successRate: 100,
          category: 'reporting',
          priority: 'medium',
          createdBy: 'mike.rodriguez@company.com',
          createdAt: new Date('2023-12-01'),
          tags: ['reporting', 'performance', 'weekly']
        },
        {
          id: '3',
          name: 'Client Satisfaction Follow-up',
          description: 'Send satisfaction survey 2 days after assessment completion',
          isActive: true,
          trigger: {
            type: 'event',
            event: { source: 'assessment', action: 'completed' }
          },
          conditions: [
            {
              id: 'c1',
              field: 'assessment.type',
              operator: 'not_equals',
              value: 'internal'
            }
          ],
          actions: [
            {
              id: 'a1',
              type: 'email',
              config: {
                to: '{{client.email}}',
                template: 'satisfaction-survey',
                delay: 2880 // 48 hours in minutes
              },
              delay: 2880
            }
          ],
          lastRun: new Date('2024-01-14T15:30:00'),
          runCount: 89,
          successRate: 94.4,
          category: 'notification',
          priority: 'medium',
          createdBy: 'emily.davis@company.com',
          createdAt: new Date('2023-11-15'),
          tags: ['client-satisfaction', 'surveys', 'follow-up']
        },
        {
          id: '4',
          name: 'High-Value Opportunity Alert',
          description: 'Notify sales team when assessment reveals expansion opportunities >$50k',
          isActive: true,
          trigger: {
            type: 'condition',
            condition: { field: 'assessment.estimatedValue', operator: 'greater_than', value: 50000 }
          },
          conditions: [
            {
              id: 'c1',
              field: 'assessment.status',
              operator: 'equals',
              value: 'completed'
            },
            {
              id: 'c2',
              field: 'assessment.opportunityFlags',
              operator: 'contains',
              value: 'expansion',
              logicalOperator: 'AND'
            }
          ],
          actions: [
            {
              id: 'a1',
              type: 'slack',
              config: {
                channel: '#sales-opportunities',
                message: 'New high-value opportunity identified: {{assessment.client}} - ${{assessment.estimatedValue}}'
              }
            },
            {
              id: 'a2',
              type: 'create_task',
              config: {
                assignee: 'sales-team',
                title: 'Follow up on {{assessment.client}} expansion opportunity',
                priority: 'high'
              }
            }
          ],
          lastRun: new Date('2024-01-12T14:22:00'),
          runCount: 23,
          successRate: 100,
          category: 'integration',
          priority: 'critical',
          createdBy: 'alex.thompson@company.com',
          createdAt: new Date('2023-10-20'),
          tags: ['sales', 'opportunities', 'high-value']
        },
        {
          id: '5',
          name: 'Resource Utilization Monitor',
          description: 'Alert when team utilization drops below 75% or exceeds 95%',
          isActive: true,
          trigger: {
            type: 'schedule',
            schedule: { frequency: 'hourly', time: '00' }
          },
          conditions: [
            {
              id: 'c1',
              field: 'team.utilization',
              operator: 'less_than',
              value: 75
            },
            {
              id: 'c2',
              field: 'team.utilization',
              operator: 'greater_than',
              value: 95,
              logicalOperator: 'OR'
            }
          ],
          actions: [
            {
              id: 'a1',
              type: 'teams',
              config: {
                channel: 'operations',
                urgency: 'normal'
              }
            }
          ],
          lastRun: new Date('2024-01-15T14:00:00'),
          runCount: 168,
          successRate: 99.4,
          category: 'assessment',
          priority: 'medium',
          createdBy: 'david.park@company.com',
          createdAt: new Date('2023-12-10'),
          tags: ['utilization', 'monitoring', 'efficiency']
        }
      ];

      setAutomations(demoAutomations);
      setLoading(false);
    } catch (error) {
      console.error('Error loading automations:', error);
      setLoading(false);
    }
  };

  const loadExecutions = async () => {
    // Demo execution history
    const demoExecutions: AutomationExecution[] = [
      {
        id: 'e1',
        automationId: '1',
        startTime: new Date('2024-01-15T09:00:00'),
        endTime: new Date('2024-01-15T09:00:32'),
        status: 'completed',
        result: { emailsSent: 3, clientsNotified: 3 },
        logs: ['Started execution', 'Found 3 overdue assessments', 'Sent 3 escalation emails', 'Completed successfully']
      },
      {
        id: 'e2',
        automationId: '3',
        startTime: new Date('2024-01-14T15:30:00'),
        endTime: new Date('2024-01-14T15:30:15'),
        status: 'completed',
        result: { surveysSent: 1 },
        logs: ['Assessment completion detected', 'Client email validated', 'Survey scheduled for 48h delay', 'Completed']
      }
    ];

    setExecutions(demoExecutions);
  };

  const toggleAutomation = async (id: string) => {
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === id 
          ? { ...automation, isActive: !automation.isActive }
          : automation
      )
    );
  };

  const deleteAutomation = async (id: string) => {
    if (confirm('Are you sure you want to delete this automation?')) {
      setAutomations(prev => prev.filter(automation => automation.id !== id));
    }
  };

  const duplicateAutomation = async (automation: AutomationRule) => {
    const newAutomation: AutomationRule = {
      ...automation,
      id: Date.now().toString(),
      name: `${automation.name} (Copy)`,
      isActive: false,
      lastRun: null,
      runCount: 0,
      successRate: 0,
      createdAt: new Date()
    };
    
    setAutomations(prev => [newAutomation, ...prev]);
  };

  const filteredAutomations = automations.filter(automation => {
    const matchesCategory = selectedCategory === 'all' || automation.category === selectedCategory;
    const matchesSearch = automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         automation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         automation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Timer className="h-4 w-4 text-warning animate-pulse" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-alert" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-text-secondary" />;
      default: return <Clock className="h-4 w-4 text-text-secondary" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assessment': return <BarChart3 className="h-4 w-4" />;
      case 'notification': return <Bell className="h-4 w-4" />;
      case 'escalation': return <AlertCircle className="h-4 w-4" />;
      case 'reporting': return <FileText className="h-4 w-4" />;
      case 'integration': return <GitBranch className="h-4 w-4" />;
      default: return <Workflow className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-alert bg-alert/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-primary bg-primary/10';
      case 'low': return 'text-text-secondary bg-text-secondary/10';
      default: return 'text-text-secondary bg-text-secondary/10';
    }
  };

  const quickActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search automations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text placeholder:text-text-secondary"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text"
      >
        <option value="all">All Categories</option>
        <option value="assessment">Assessment</option>
        <option value="notification">Notification</option>
        <option value="escalation">Escalation</option>
        <option value="reporting">Reporting</option>
        <option value="integration">Integration</option>
      </select>
      <Button onClick={() => setShowCreateDialog(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Automation
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-sm text-text-secondary">Loading automations...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Automations"
      subtitle="Intelligent workflow automation for your assessment practice"
      actions={quickActions}
      userEmail={user?.email ?? null}
    >
      <div className="space-y-6">
        {/* Automation Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Active Automations</p>
                <p className="text-2xl font-bold text-text">
                  {automations.filter(a => a.isActive).length}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  of {automations.length} total
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Workflow className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Success Rate</p>
                <p className="text-2xl font-bold text-text">
                  {Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length)}%
                </p>
                <p className="text-sm text-success mt-1">Highly reliable</p>
              </div>
              <div className="rounded-full bg-success/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Executions</p>
                <p className="text-2xl font-bold text-text">
                  {automations.reduce((sum, a) => sum + a.runCount, 0)}
                </p>
                <p className="text-sm text-text-secondary mt-1">This month</p>
              </div>
              <div className="rounded-full bg-warning/10 p-3">
                <Activity className="h-6 w-6 text-warning" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Time Saved</p>
                <p className="text-2xl font-bold text-text">47h</p>
                <p className="text-sm text-success mt-1">+23% this month</p>
              </div>
              <div className="rounded-full bg-success/10 p-3">
                <Clock className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Automation Rules List */}
        <Card className="p-6">
          <CardHeader 
            title="Automation Rules"
            subtitle={`${filteredAutomations.length} automation${filteredAutomations.length !== 1 ? 's' : ''} found`}
          />
          
          <div className="mt-6 space-y-4">
            {filteredAutomations.map((automation) => (
              <div
                key={automation.id}
                className="rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface/80"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {automation.isActive ? (
                        <div className="h-2 w-2 rounded-full bg-success" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-text-secondary" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(automation.category)}
                        <h3 className="font-semibold text-text">{automation.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(automation.priority)}`}>
                          {automation.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-text-secondary mb-3">{automation.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {automation.runCount} runs
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {automation.successRate}% success
                        </div>
                        {automation.lastRun && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last run: {automation.lastRun.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        {automation.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAutomation(automation.id)}
                    >
                      {automation.isActive ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateDialog(true)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateAutomation(automation)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAutomation(automation.id)}
                      className="text-alert hover:text-alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Executions */}
        <Card className="p-6">
          <CardHeader 
            title="Recent Executions"
            subtitle="Latest automation run history and results"
          />
          
          <div className="mt-6">
            <div className="space-y-3">
              {executions.slice(0, 10).map((execution) => {
                const automation = automations.find(a => a.id === execution.automationId);
                return (
                  <div
                    key={execution.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-3"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(execution.status)}
                      <div>
                        <p className="font-medium text-text">{automation?.name}</p>
                        <p className="text-sm text-text-secondary">
                          {execution.startTime.toLocaleString()}
                          {execution.endTime && (
                            <span> • {Math.round((execution.endTime.getTime() - execution.startTime.getTime()) / 1000)}s</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        execution.status === 'completed' ? 'text-success' :
                        execution.status === 'failed' ? 'text-alert' :
                        execution.status === 'running' ? 'text-warning' :
                        'text-text-secondary'
                      }`}>
                        {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                      </p>
                      {execution.result && (
                        <p className="text-xs text-text-secondary">
                          {Object.entries(execution.result).map(([key, value]) => 
                            `${key}: ${value}`
                          ).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Create/Edit Automation Dialog would go here */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4">Create New Automation</h2>
            <p className="text-text-secondary mb-6">
              Automation builder coming soon. This will include drag-and-drop workflow designer,
              advanced condition builder, and integration with popular tools.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button disabled>
                Create Automation
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}