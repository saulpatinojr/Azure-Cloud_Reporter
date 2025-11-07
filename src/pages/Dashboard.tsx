import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAssessments, getDashboardStats } from '../services/assessmentService';
import { getClients } from '../services/clientService';
import type { Assessment, Client } from '../types';
import { formatDate } from '../utils/helpers';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, CardHeader, Badge, Progress } from '../design-system';
import { SampleChart } from '../components/SampleChart';
import { Calendar, UploadCloud, BarChart3, Sparkles, ArrowUpRight } from 'lucide-react';

type StageKey = 'plan' | 'collect' | 'analyze' | 'deliver';

const stageOrder: StageKey[] = ['plan', 'collect', 'analyze', 'deliver'];
const stageLabels: Record<StageKey, string> = {
  plan: 'Plan',
  collect: 'Collect',
  analyze: 'Analyze',
  deliver: 'Deliver',
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({ totalAssessments: 0, inProgress: 0, completed: 0, ready: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only redirect if we're not in demo mode (check current path)
    if (!user && window.location.pathname !== '/dashboard') {
      navigate('/');
      return;
    }
    if (user) {
      loadData();
    } else {
      // Demo mode - use mock data
      setStats({ totalAssessments: 3, inProgress: 2, completed: 1, ready: 0 });
      setLoading(false);
    }
  }, [user, navigate]);

  const loadData = async () => {
    if (!user) {
      // Demo mode - don't try to load real data
      return;
    }

    try {
      const [assessmentsData, clientsData, statsData] = await Promise.all([
        getAssessments(user.uid),
        getClients(user.uid),
        getDashboardStats(user.uid),
      ]);

      setAssessments(assessmentsData);
      setClients(clientsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stageSummary = useMemo(() => {
    const base = stageOrder.reduce<Record<StageKey, number>>((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<StageKey, number>);

    assessments.forEach((assessment) => {
      const stage = mapStatusToStage(assessment.status);
      base[stage] += 1;
    });

    return base;
  }, [assessments]);

  const upcomingMilestones = useMemo(() => {
    return assessments
      .filter((assessment) => assessment.deadline)
      .sort((a, b) => (a.deadline?.toMillis() ?? 0) - (b.deadline?.toMillis() ?? 0))
      .slice(0, 3)
      .map((assessment) => ({
        id: assessment.id,
        name: assessment.name,
        deadline: assessment.deadline,
        client: clients.find((client) => client.id === assessment.clientId)?.name ?? 'Unknown client',
      }));
  }, [assessments, clients]);

  const workspaceHighlights = useMemo(() => {
    return assessments
      .slice(0, 6)
      .map((assessment) => ({
        id: assessment.id,
        name: assessment.name,
        client: clients.find((client) => client.id === assessment.clientId)?.name ?? 'Unknown client',
        readinessPercentage: assessment.readinessPercentage,
        stage: mapStatusToStage(assessment.status),
        updatedAt: assessment.updatedAt,
      }));
  }, [assessments, clients]);

  const quickActions = (
    <div className="flex items-center gap-3">
      <Button variant="secondary" size="md" onClick={() => navigate('/clients/new')}>
        New Client
      </Button>
      <Button size="md" onClick={() => navigate('/assessments/new')}>
        New Assessment
      </Button>
      <Button variant="ghost" size="md" onClick={async () => {
        try {
          await signOut();
          navigate('/');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }}>
        Sign Out
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-sm text-slate-500">Preparing your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Workspace Hub"
      subtitle="Orchestrate assessments, monitor progress, and collaborate with your team."
      actions={quickActions}
      userEmail={user?.email ?? null}
    >
      <div className="space-y-8">
        <section>
          <div className="grid gap-4 md:grid-cols-4">
            <StatusTile
              title="Active Assessments"
              value={stats.totalAssessments}
              trend="▲ 12% vs last month"
              icon={<BarChart3 className="h-5 w-5 text-indigo-500" />}
            />
            <StatusTile
              title="In Progress"
              value={stats.inProgress}
              trend="Stages in Collect & Analyze"
              icon={<UploadCloud className="h-5 w-5 text-sky-500" />}
            />
            <StatusTile
              title="Ready for Review"
              value={stats.ready}
              trend="Awaiting MSP approval"
              icon={<Sparkles className="h-5 w-5 text-emerald-500" />}
            />
            <StatusTile
              title="Completed"
              value={stats.completed}
              trend="Delivered to clients"
              icon={<ArrowUpRight className="h-5 w-5 text-purple-500" />}
            />
          </div>
        </section>

        <section>
          <SampleChart />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2" padding="lg">
            <CardHeader
              title="Active workspaces"
              subtitle="Track progress and jump back into assessments that need your attention."
              action={
                <Button variant="secondary" size="sm" onClick={() => navigate('/assessments/new')}>
                  Start new assessment
                </Button>
              }
            />
            <div className="space-y-4">
              {workspaceHighlights.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-secondary bg-surface">
                  No assessments yet. Create your first workspace to see progress, tasks, and AI recommendations.
                </div>
              )}
              {workspaceHighlights.map((workspace) => (
                <button
                  type="button"
                  key={workspace.id}
                  onClick={() => navigate(`/assessments/${workspace.id}`)}
                  className="w-full rounded-2xl border border-border bg-surface px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-text">{workspace.name}</p>
                      <p className="text-sm text-text-secondary">{workspace.client}</p>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 md:max-w-md">
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>Readiness</span>
                        <span>{workspace.readinessPercentage}%</span>
                      </div>
                      <Progress value={workspace.readinessPercentage} />
                    </div>
                    <Badge variant="primary">{stageLabels[workspace.stage]}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-text-secondary">
                    Updated {workspace.updatedAt ? formatDate(workspace.updatedAt) : 'recently'}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <CardHeader title="Pipeline stages" subtitle="Where assessments sit across the playbook." />
            <ul className="space-y-4">
              {stageOrder.map((stage) => (
                <li key={stage} className="rounded-2xl border border-border px-4 py-3 bg-surface">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-text">{stageLabels[stage]}</p>
                      <p className="text-xs text-text-secondary">
                        {stageSummary[stage]} assessment{stageSummary[stage] === 1 ? '' : 's'}
                      </p>
                    </div>
                    <Badge variant="neutral">Stage {stageOrder.indexOf(stage) + 1}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <CardHeader title="Upcoming milestones" subtitle="Deadlines and handoffs happening next." />
            <div className="space-y-4">
              {upcomingMilestones.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-text-secondary bg-surface">
                  Add deadlines to your assessments to see them here alongside stage-specific reminders.
                </p>
              )}
              {upcomingMilestones.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-border px-4 py-3 bg-surface">
                  <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-text">{item.name}</p>
                    <p className="text-sm text-text-secondary">{item.client}</p>
                    <p className="mt-1 text-xs text-text-secondary">Due {item.deadline ? formatDate(item.deadline) : 'TBD'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <CardHeader
              title="Today's focus"
              subtitle="Quick actions surfaced by AI routines and automation rules."
            />
            <div className="space-y-4">
              <FocusItem
                icon={<UploadCloud className="h-4 w-4 text-indigo-500" />}
                title="Upload telemetry: RVTools & Azure Advisor"
                description="Vanguard Corp assessment is waiting for Collect stage artifacts."
                ctaLabel="Open upload center"
                onClick={() => navigate('/uploads')}
              />
              <FocusItem
                icon={<Sparkles className="h-4 w-4 text-emerald-500" />}
                title="Review AI insights"
                description="3 narrative sections ready for approval in CloudFit readiness report."
                ctaLabel="Open AI review"
                onClick={() => navigate('/assessments')}
              />
              <FocusItem
                icon={<BarChart3 className="h-4 w-4 text-purple-500" />}
                title="Share benchmark dashboard"
                description="Invite client stakeholders to explore interactive benchmarks."
                ctaLabel="Copy client link"
                onClick={() => navigate('/insights')}
              />
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

function mapStatusToStage(status: Assessment['status']): StageKey {
  switch (status) {
    case 'draft':
      return 'plan';
    case 'in_progress':
    case 'generating':
      return 'collect';
    case 'ready':
      return 'analyze';
    case 'completed':
      return 'deliver';
    default:
      return 'plan';
  }
}

type StatusTileProps = {
  title: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
};

function StatusTile({ title, value, trend, icon }: StatusTileProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface/90 p-5 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <span className="rounded-full bg-surface p-2">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-text">{value}</p>
      <p className="mt-2 text-xs font-medium text-success">{trend}</p>
    </div>
  );
}

type FocusItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  onClick: () => void;
};

function FocusItem({ icon, title, description, ctaLabel, onClick }: FocusItemProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-surface p-2">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text">{title}</p>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
          <button
            type="button"
            onClick={onClick}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {ctaLabel}
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
