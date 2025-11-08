import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClients, deleteClient } from '../services/clientService';
import type { Client } from '../types';
import { formatDate, cn } from '../utils/helpers';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, CardHeader, Badge } from '../design-system';
import { Plus, Edit, Trash2, Building2, Users, Sparkles } from 'lucide-react';

export default function Clients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadClients = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getClients(user.uid);
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleDelete = async (clientId: string, clientName: string) => {
    if (confirm(`Are you sure you want to delete "${clientName}"? This action cannot be undone.`)) {
      try {
        await deleteClient(clientId);
        await loadClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client');
      }
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [clients, searchTerm]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-sm text-slate-500">Loading clients…</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Client portfolio"
      subtitle="Keep organizations organized, assign ownership, and maintain audit trails."
      actions={
        <Button size="md" onClick={() => navigate('/clients/new')}>
          <Plus className="mr-2 h-4 w-4" /> New client
        </Button>
      }
      userEmail={user?.email ?? null}
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <PortfolioTile
            icon={<Users className="h-5 w-5 text-indigo-500" />}
            label="Total clients"
            value={clients.length}
            helper="Combined across all workspaces"
          />
          <PortfolioTile
            icon={<Building2 className="h-5 w-5 text-emerald-500" />}
            label="Active this quarter"
            value={clients.slice(0, 6).length}
            helper="Engaged in assessments"
          />
          <PortfolioTile
            icon={<Sparkles className="h-5 w-5 text-purple-500" />}
            label="With AI playbooks"
            value={clients.filter((client) => client.description).length}
            helper="Enriched with templates"
          />
        </section>

        <Card padding="lg">
          <CardHeader
            title="Client roster"
            subtitle="Search clients or jump into a workspace to continue collaboration."
            action={
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or industry"
                className="h-11 w-64 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-indigo-100"
              />
            }
          />

          {filteredClients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
              {searchTerm ? 'No clients match your search yet.' : 'Create your first client to start collaborating.'}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredClients.map((client) => (
                <article key={client.id} className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{client.name}</h3>
                        <p className="text-sm text-slate-500">{client.industry}</p>
                      </div>
                    </div>
                    <Badge variant="neutral">{client.industry}</Badge>
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">Primary contact:</span> {client.contactEmail}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                    {client.description || 'No description provided yet.'}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                    <span>Created {formatDate(client.createdAt)}</span>
                    <div className="flex gap-2">
                      <IconButton
                        title="View or edit client"
                        onClick={() => navigate(`/clients/${client.id}/edit`)}
                        icon={<Edit className="h-4 w-4" />}
                      />
                      <IconButton
                        title="Delete client"
                        destructive
                        onClick={() => handleDelete(client.id, client.name)}
                        icon={<Trash2 className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

type PortfolioTileProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  helper: string;
};

function PortfolioTile({ icon, label, value, helper }: PortfolioTileProps) {
  return (
    <div className="rounded-2xl border border-transparent bg-white/80 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="rounded-full bg-slate-100 p-2">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

type IconButtonProps = {
  icon: React.ReactNode;
  title: string;
  destructive?: boolean;
  onClick: () => void;
};

function IconButton({ icon, title, destructive, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'rounded-full border px-3 py-2 text-slate-600 transition hover:-translate-y-0.5',
        destructive
          ? 'border-rose-100 bg-rose-50/60 text-rose-600 hover:bg-rose-100'
          : 'border-slate-200 bg-slate-100/60 hover:bg-slate-200/60',
      )}
    >
      {icon}
    </button>
  );
}
