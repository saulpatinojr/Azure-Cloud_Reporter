import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, CardHeader } from '../design-system';
import { 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Target, 
  Download, Filter, BarChart3,
  CheckCircle2, Activity
} from 'lucide-react';

// Enterprise analytics data types
interface AssessmentMetrics {
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  totalRevenue: number;
  avgAssessmentValue: number;
  avgCompletionTime: number;
  clientSatisfactionScore: number;
  teamUtilization: number;
}

interface TimeSeriesData {
  month: string;
  assessments: number;
  revenue: number;
  completionRate: number;
}

interface ClientSegmentData {
  segment: string;
  count: number;
  revenue: number;
  avgValue: number;
  color: string;
  [key: string]: string | number; // Add index signature for chart compatibility
}

interface TechnologyStackData {
  technology: string;
  assessments: number;
  avgValue: number;
  trend: number;
}

interface TeamPerformanceData {
  member: string;
  assessments: number;
  avgTime: number;
  satisfaction: number;
  utilization: number;
}

export default function Insights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last-12-months');
  
  // Analytics state
  const [metrics, setMetrics] = useState<AssessmentMetrics>({
    totalAssessments: 0,
    completedAssessments: 0,
    inProgressAssessments: 0,
    totalRevenue: 0,
    avgAssessmentValue: 0,
    avgCompletionTime: 0,
    clientSatisfactionScore: 0,
    teamUtilization: 0
  });
  
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [clientSegments, setClientSegments] = useState<ClientSegmentData[]>([]);
  const [techStackData, setTechStackData] = useState<TechnologyStackData[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformanceData[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [user, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      // In a real implementation, these would be API calls to backend analytics services
      // For demo purposes, we'll generate realistic data
      
      const demoMetrics: AssessmentMetrics = {
        totalAssessments: 47,
        completedAssessments: 32,
        inProgressAssessments: 15,
        totalRevenue: 2350000,
        avgAssessmentValue: 73437,
        avgCompletionTime: 18.5,
        clientSatisfactionScore: 4.7,
        teamUtilization: 87.2
      };

      const demoTimeSeries: TimeSeriesData[] = [
        { month: 'Jan', assessments: 8, revenue: 520000, completionRate: 85 },
        { month: 'Feb', assessments: 6, revenue: 390000, completionRate: 90 },
        { month: 'Mar', assessments: 10, revenue: 650000, completionRate: 82 },
        { month: 'Apr', assessments: 12, revenue: 780000, completionRate: 88 },
        { month: 'May', assessments: 9, revenue: 585000, completionRate: 91 },
        { month: 'Jun', assessments: 11, revenue: 715000, completionRate: 87 },
        { month: 'Jul', assessments: 8, revenue: 520000, completionRate: 89 },
        { month: 'Aug', assessments: 13, revenue: 845000, completionRate: 84 },
        { month: 'Sep', assessments: 10, revenue: 650000, completionRate: 92 },
        { month: 'Oct', assessments: 14, revenue: 910000, completionRate: 86 },
        { month: 'Nov', assessments: 12, revenue: 780000, completionRate: 90 },
        { month: 'Dec', assessments: 15, revenue: 975000, completionRate: 88 }
      ];

      const demoClientSegments: ClientSegmentData[] = [
        { segment: 'Enterprise (1000+ users)', count: 12, revenue: 1200000, avgValue: 100000, color: '#8884d8' },
        { segment: 'Mid-Market (200-1000)', count: 18, revenue: 810000, avgValue: 45000, color: '#82ca9d' },
        { segment: 'SMB (50-200)', count: 17, revenue: 340000, avgValue: 20000, color: '#ffc658' }
      ];

      const demoTechStack: TechnologyStackData[] = [
        { technology: 'Azure', assessments: 35, avgValue: 85000, trend: 15 },
        { technology: 'AWS', assessments: 8, avgValue: 65000, trend: -5 },
        { technology: 'Google Cloud', assessments: 4, avgValue: 70000, trend: 25 },
        { technology: 'Hybrid Cloud', assessments: 12, avgValue: 120000, trend: 8 },
        { technology: 'On-Premises', assessments: 6, avgValue: 35000, trend: -12 }
      ];

      const demoTeamPerformance: TeamPerformanceData[] = [
        { member: 'Sarah Chen', assessments: 8, avgTime: 16.2, satisfaction: 4.9, utilization: 92 },
        { member: 'Mike Rodriguez', assessments: 6, avgTime: 18.1, satisfaction: 4.7, utilization: 88 },
        { member: 'Alex Thompson', assessments: 7, avgTime: 17.5, satisfaction: 4.8, utilization: 85 },
        { member: 'Emily Davis', assessments: 9, avgTime: 15.8, satisfaction: 4.9, utilization: 94 },
        { member: 'David Park', assessments: 5, avgTime: 19.3, satisfaction: 4.6, utilization: 82 }
      ];

      setMetrics(demoMetrics);
      setTimeSeriesData(demoTimeSeries);
      setClientSegments(demoClientSegments);
      setTechStackData(demoTechStack);
      setTeamPerformance(demoTeamPerformance);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const quickActions = (
    <div className="flex items-center gap-3">
      <select
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text"
      >
        <option value="last-30-days">Last 30 Days</option>
        <option value="last-90-days">Last 90 Days</option>
        <option value="last-12-months">Last 12 Months</option>
        <option value="year-to-date">Year to Date</option>
      </select>
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-sm text-text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Insights & Analytics"
      subtitle="Business intelligence and performance analytics for your assessment practice"
      actions={quickActions}
      userEmail={user?.email ?? null}
    >
      <div className="space-y-6">
        {/* Key Metrics Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Revenue</p>
                <p className="text-2xl font-bold text-text">{formatCurrency(metrics.totalRevenue)}</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-success">+12.5%</span>
                  <span className="text-text-secondary ml-1">vs last period</span>
                </div>
              </div>
              <div className="rounded-full bg-success/10 p-3">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Assessments Completed</p>
                <p className="text-2xl font-bold text-text">{metrics.completedAssessments}</p>
                <div className="flex items-center mt-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-1" />
                  <span className="text-text-secondary">
                    {formatPercentage((metrics.completedAssessments / metrics.totalAssessments) * 100)} completion rate
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Avg Assessment Value</p>
                <p className="text-2xl font-bold text-text">{formatCurrency(metrics.avgAssessmentValue)}</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-success">+8.3%</span>
                  <span className="text-text-secondary ml-1">vs last period</span>
                </div>
              </div>
              <div className="rounded-full bg-warning/10 p-3">
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Client Satisfaction</p>
                <p className="text-2xl font-bold text-text">{metrics.clientSatisfactionScore}/5.0</p>
                <div className="flex items-center mt-2 text-sm">
                  <Activity className="h-4 w-4 text-success mr-1" />
                  <span className="text-text-secondary">Based on 47 reviews</span>
                </div>
              </div>
              <div className="rounded-full bg-success/10 p-3">
                <Users className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Revenue and Assessment Trends */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <CardHeader 
              title="Revenue Trends"
              subtitle="Monthly revenue performance over time"
            />
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--text-secondary))" fontSize={12} />
                  <YAxis 
                    stroke="hsl(var(--text-secondary))" 
                    fontSize={12}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--surface))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader 
              title="Assessment Volume"
              subtitle="Number of assessments completed monthly"
            />
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--text-secondary))" fontSize={12} />
                  <YAxis stroke="hsl(var(--text-secondary))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--surface))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="assessments" 
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Client Segmentation and Technology Stack */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <CardHeader 
              title="Client Segmentation"
              subtitle="Revenue distribution by client size"
            />
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clientSegments}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="revenue"
                  >
                    {clientSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--surface))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader 
              title="Technology Focus"
              subtitle="Assessment distribution by cloud platform"
            />
            <div className="mt-6 space-y-4">
              {techStackData.map((tech) => (
                <div key={tech.technology} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      tech.technology === 'Azure' ? 'bg-blue-500' :
                      tech.technology === 'AWS' ? 'bg-orange-500' :
                      tech.technology === 'Google Cloud' ? 'bg-green-500' :
                      tech.technology === 'Hybrid Cloud' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium text-text">{tech.technology}</p>
                      <p className="text-sm text-text-secondary">{tech.assessments} assessments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-text">{formatCurrency(tech.avgValue)}</p>
                    <div className="flex items-center gap-1">
                      {tech.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-alert" />
                      )}
                      <span className={`text-xs ${tech.trend > 0 ? 'text-success' : 'text-alert'}`}>
                        {Math.abs(tech.trend)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Performance */}
        <Card className="p-6">
          <CardHeader 
            title="Team Performance"
            subtitle="Individual consultant metrics and utilization"
          />
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Team Member</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Assessments</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Avg Time (days)</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Satisfaction</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((member) => (
                  <tr key={member.member} className="border-b border-border hover:bg-surface">
                    <td className="py-3 px-4 font-medium text-text">{member.member}</td>
                    <td className="text-center py-3 px-4 text-text">{member.assessments}</td>
                    <td className="text-center py-3 px-4 text-text">{member.avgTime.toFixed(1)}</td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-text">{member.satisfaction.toFixed(1)}</span>
                        <span className="text-text-secondary">/5.0</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-surface rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${member.utilization}%` }}
                          />
                        </div>
                        <span className="ml-2 text-text">{member.utilization}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}