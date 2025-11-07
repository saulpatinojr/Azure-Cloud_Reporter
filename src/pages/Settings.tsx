import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, CardHeader } from '../design-system';
import { 
  Users, Shield, Bell, Cloud,
  Globe, CreditCard, MessageSquare,
  Save, RefreshCw,
  Building,
  Plus, Edit3, Trash2
} from 'lucide-react';// Settings data types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'consultant' | 'viewer';
  department: string;
  phone?: string;
  avatar?: string;
  lastLogin: Date;
  isActive: boolean;
  permissions: string[];
}

interface TeamSettings {
  defaultAssessmentTemplate: string;
  autoAssignmentRules: boolean;
  workloadBalancing: boolean;
  notificationPreferences: {
    email: boolean;
    slack: boolean;
    inApp: boolean;
  };
  assessmentDefaults: {
    priority: 'low' | 'medium' | 'high';
    estimatedDuration: number;
    followUpDays: number;
  };
}

interface SecuritySettings {
  mfaRequired: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
  ipWhitelist: string[];
  auditLogging: boolean;
}

interface IntegrationSettings {
  slack: {
    enabled: boolean;
    webhook?: string;
    channels: string[];
  };
  teams: {
    enabled: boolean;
    webhook?: string;
  };
  azure: {
    tenantId?: string;
    subscriptions: string[];
  };
  storage: {
    provider: 'firebase' | 'azure' | 's3';
    retentionDays: number;
    autoBackup: boolean;
  };
}

interface CompanyProfile {
  name: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  billing: {
    plan: 'starter' | 'professional' | 'enterprise';
    seats: number;
    renewalDate: Date;
  };
}

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [teamSettings, setTeamSettings] = useState<TeamSettings>({
    defaultAssessmentTemplate: 'comprehensive',
    autoAssignmentRules: true,
    workloadBalancing: true,
    notificationPreferences: {
      email: true,
      slack: false,
      inApp: true
    },
    assessmentDefaults: {
      priority: 'medium',
      estimatedDuration: 14,
      followUpDays: 3
    }
  });
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    mfaRequired: true,
    sessionTimeout: 480, // 8 hours
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true
    },
    ipWhitelist: [],
    auditLogging: true
  });
  
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
    slack: {
      enabled: false,
      channels: ['#assessments', '#alerts']
    },
    teams: {
      enabled: false
    },
    azure: {
      subscriptions: []
    },
    storage: {
      provider: 'firebase',
      retentionDays: 2555, // 7 years
      autoBackup: true
    }
  });
  
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'Cloud Assessment Solutions',
    address: {
      street: '123 Business Ave',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@cloudassessment.com',
      website: 'https://cloudassessment.com'
    },
    billing: {
      plan: 'enterprise',
      seats: 25,
      renewalDate: new Date('2024-12-31')
    }
  });

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      // In a real implementation, these would be API calls to load settings from Firestore
      
      const demoUsers: UserProfile[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          email: 'sarah.chen@company.com',
          role: 'admin',
          department: 'Cloud Engineering',
          phone: '+1 (555) 001-0001',
          lastLogin: new Date('2024-01-15T14:30:00'),
          isActive: true,
          permissions: ['admin:all', 'assessments:all', 'reports:all', 'settings:all']
        },
        {
          id: '2',
          name: 'Mike Rodriguez',
          email: 'mike.rodriguez@company.com',
          role: 'manager',
          department: 'Cloud Engineering',
          phone: '+1 (555) 001-0002',
          lastLogin: new Date('2024-01-15T16:45:00'),
          isActive: true,
          permissions: ['assessments:all', 'reports:read', 'team:manage']
        },
        {
          id: '3',
          name: 'Emily Davis',
          email: 'emily.davis@company.com',
          role: 'consultant',
          department: 'Cloud Engineering',
          phone: '+1 (555) 001-0003',
          lastLogin: new Date('2024-01-15T13:15:00'),
          isActive: true,
          permissions: ['assessments:assigned', 'reports:read']
        },
        {
          id: '4',
          name: 'Alex Thompson',
          email: 'alex.thompson@company.com',
          role: 'consultant',
          department: 'Sales Engineering',
          phone: '+1 (555) 001-0004',
          lastLogin: new Date('2024-01-14T17:20:00'),
          isActive: true,
          permissions: ['assessments:assigned', 'reports:read']
        },
        {
          id: '5',
          name: 'David Park',
          email: 'david.park@company.com',
          role: 'viewer',
          department: 'Operations',
          lastLogin: new Date('2024-01-12T09:30:00'),
          isActive: false,
          permissions: ['reports:read']
        }
      ];

      setUsers(demoUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real implementation, this would save to Firestore
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-alert bg-alert/10';
      case 'manager': return 'text-warning bg-warning/10';
      case 'consultant': return 'text-primary bg-primary/10';
      case 'viewer': return 'text-text-secondary bg-text-secondary/10';
      default: return 'text-text-secondary bg-text-secondary/10';
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'users', label: 'Users & Permissions', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'billing', label: 'Billing & Usage', icon: CreditCard }
  ];

  const quickActions = (
    <div className="flex items-center gap-3">
      <Button variant="outline" disabled={saving}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset
      </Button>
      <Button onClick={saveSettings} disabled={saving}>
        {saving ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save Changes
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-sm text-text-secondary">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Settings"
      subtitle="Configure your assessment platform and team preferences"
      actions={quickActions}
      userEmail={user?.email ?? null}
    >
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:bg-surface hover:text-text'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'general' && (
            <Card className="p-6">
              <CardHeader title="General Settings" subtitle="Basic platform configuration and preferences" />
              
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Default Assessment Template
                    </label>
                    <select
                      value={teamSettings.defaultAssessmentTemplate}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, defaultAssessmentTemplate: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                    >
                      <option value="comprehensive">Comprehensive Assessment</option>
                      <option value="security-focused">Security-Focused</option>
                      <option value="migration-ready">Migration Readiness</option>
                      <option value="quick-scan">Quick Scan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Default Priority Level
                    </label>
                    <select
                      value={teamSettings.assessmentDefaults.priority}
                      onChange={(e) => setTeamSettings(prev => ({ 
                        ...prev, 
                        assessmentDefaults: { 
                          ...prev.assessmentDefaults, 
                          priority: e.target.value as 'low' | 'medium' | 'high' 
                        }
                      }))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Estimated Duration (days)
                    </label>
                    <input
                      type="number"
                      value={teamSettings.assessmentDefaults.estimatedDuration}
                      onChange={(e) => setTeamSettings(prev => ({ 
                        ...prev, 
                        assessmentDefaults: { 
                          ...prev.assessmentDefaults, 
                          estimatedDuration: parseInt(e.target.value) 
                        }
                      }))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                      min="1"
                      max="90"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Follow-up Reminder (days)
                    </label>
                    <input
                      type="number"
                      value={teamSettings.assessmentDefaults.followUpDays}
                      onChange={(e) => setTeamSettings(prev => ({ 
                        ...prev, 
                        assessmentDefaults: { 
                          ...prev.assessmentDefaults, 
                          followUpDays: parseInt(e.target.value) 
                        }
                      }))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                      min="1"
                      max="30"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-text">Auto-Assignment Rules</h4>
                      <p className="text-sm text-text-secondary">Automatically assign assessments based on expertise and workload</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={teamSettings.autoAssignmentRules}
                        onChange={(e) => setTeamSettings(prev => ({ ...prev, autoAssignmentRules: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-text">Workload Balancing</h4>
                      <p className="text-sm text-text-secondary">Distribute assessments evenly across team members</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={teamSettings.workloadBalancing}
                        onChange={(e) => setTeamSettings(prev => ({ ...prev, workloadBalancing: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'users' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <CardHeader title="Users & Permissions" subtitle="Manage team members and their access levels" />
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-text">{user.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          {!user.isActive && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium text-text-secondary bg-text-secondary/10">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                        <p className="text-xs text-text-secondary">
                          {user.department} • Last login: {user.lastLogin.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <CardHeader title="Security Settings" subtitle="Configure authentication and access controls" />
              
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-text">Require Multi-Factor Authentication</h4>
                    <p className="text-sm text-text-secondary">All users must enable MFA to access the platform</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.mfaRequired}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, mfaRequired: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    className="w-32 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                    min="15"
                    max="1440"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Users will be automatically logged out after this period of inactivity
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-text mb-4">Password Policy</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Minimum Length
                      </label>
                      <input
                        type="number"
                        value={securitySettings.passwordPolicy.minLength}
                        onChange={(e) => setSecuritySettings(prev => ({ 
                          ...prev, 
                          passwordPolicy: { 
                            ...prev.passwordPolicy, 
                            minLength: parseInt(e.target.value) 
                          }
                        }))}
                        className="w-20 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                        min="8"
                        max="32"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text">Require uppercase letters</span>
                        <input
                          type="checkbox"
                          checked={securitySettings.passwordPolicy.requireUppercase}
                          onChange={(e) => setSecuritySettings(prev => ({ 
                            ...prev, 
                            passwordPolicy: { 
                              ...prev.passwordPolicy, 
                              requireUppercase: e.target.checked 
                            }
                          }))}
                          className="rounded border-border"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text">Require numbers</span>
                        <input
                          type="checkbox"
                          checked={securitySettings.passwordPolicy.requireNumbers}
                          onChange={(e) => setSecuritySettings(prev => ({ 
                            ...prev, 
                            passwordPolicy: { 
                              ...prev.passwordPolicy, 
                              requireNumbers: e.target.checked 
                            }
                          }))}
                          className="rounded border-border"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text">Require symbols</span>
                        <input
                          type="checkbox"
                          checked={securitySettings.passwordPolicy.requireSymbols}
                          onChange={(e) => setSecuritySettings(prev => ({ 
                            ...prev, 
                            passwordPolicy: { 
                              ...prev.passwordPolicy, 
                              requireSymbols: e.target.checked 
                            }
                          }))}
                          className="rounded border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-text">Audit Logging</h4>
                    <p className="text-sm text-text-secondary">Log all user actions and system events for compliance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.auditLogging}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, auditLogging: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card className="p-6">
              <CardHeader title="Integrations" subtitle="Connect with external tools and services" />
              
              <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-purple-500 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text">Slack</h4>
                        <p className="text-sm text-text-secondary">Send notifications to Slack channels</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={integrationSettings.slack.enabled}
                        onChange={(e) => setIntegrationSettings(prev => ({ 
                          ...prev, 
                          slack: { ...prev.slack, enabled: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  {integrationSettings.slack.enabled && (
                    <div className="space-y-3 border-t border-border pt-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={integrationSettings.slack.webhook || ''}
                          onChange={(e) => setIntegrationSettings(prev => ({ 
                            ...prev, 
                            slack: { ...prev.slack, webhook: e.target.value }
                          }))}
                          placeholder="https://hooks.slack.com/services/..."
                          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Default Channels
                        </label>
                        <div className="flex gap-2">
                          {integrationSettings.slack.channels.map((channel, index) => (
                            <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text">Microsoft Teams</h4>
                        <p className="text-sm text-text-secondary">Send notifications to Teams channels</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={integrationSettings.teams.enabled}
                        onChange={(e) => setIntegrationSettings(prev => ({ 
                          ...prev, 
                          teams: { ...prev.teams, enabled: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  {integrationSettings.teams.enabled && (
                    <div className="border-t border-border pt-4">
                      <label className="block text-sm font-medium text-text mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={integrationSettings.teams.webhook || ''}
                        onChange={(e) => setIntegrationSettings(prev => ({ 
                          ...prev, 
                          teams: { ...prev.teams, webhook: e.target.value }
                        }))}
                        placeholder="https://outlook.office.com/webhook/..."
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                      <Cloud className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Azure Integration</h4>
                      <p className="text-sm text-text-secondary">Connect to Azure subscriptions for assessment data</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Tenant ID
                    </label>
                    <input
                      type="text"
                      value={integrationSettings.azure.tenantId || ''}
                      onChange={(e) => setIntegrationSettings(prev => ({ 
                        ...prev, 
                        azure: { ...prev.azure, tenantId: e.target.value }
                      }))}
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'company' && (
            <Card className="p-6">
              <CardHeader title="Company Profile" subtitle="Manage your organization information and branding" />
              
              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyProfile.name}
                    onChange={(e) => setCompanyProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={companyProfile.contact.phone}
                      onChange={(e) => setCompanyProfile(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, phone: e.target.value }
                      }))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={companyProfile.contact.email}
                      onChange={(e) => setCompanyProfile(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, email: e.target.value }
                      }))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companyProfile.contact.website}
                    onChange={(e) => setCompanyProfile(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, website: e.target.value }
                    }))}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-text mb-4">Address</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={companyProfile.address.street}
                      onChange={(e) => setCompanyProfile(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                    />
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={companyProfile.address.city}
                        onChange={(e) => setCompanyProfile(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={companyProfile.address.state}
                        onChange={(e) => setCompanyProfile(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, state: e.target.value }
                        }))}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={companyProfile.address.zip}
                        onChange={(e) => setCompanyProfile(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, zip: e.target.value }
                        }))}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-6">
              <CardHeader title="Billing & Usage" subtitle="Manage your subscription and view usage metrics" />
              
              <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-text">Enterprise Plan</h4>
                      <p className="text-sm text-text-secondary">Advanced features for growing teams</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-text">$99</p>
                      <p className="text-sm text-text-secondary">per user/month</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-text-secondary">Seats Used</p>
                      <p className="text-lg font-medium text-text">{users.filter(u => u.isActive).length} / {companyProfile.billing.seats}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Renewal Date</p>
                      <p className="text-lg font-medium text-text">{companyProfile.billing.renewalDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Next Bill</p>
                      <p className="text-lg font-medium text-text">$2,475</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-medium text-text mb-2">Storage Usage</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-surface rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full" style={{ width: '73%' }} />
                      </div>
                      <span className="text-sm text-text">73%</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">147 GB of 200 GB used</p>
                  </div>
                  
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-medium text-text mb-2">API Calls</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-surface rounded-full h-3">
                        <div className="bg-warning h-3 rounded-full" style={{ width: '42%' }} />
                      </div>
                      <span className="text-sm text-text">42%</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">8,400 of 20,000 calls this month</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}