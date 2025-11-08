import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createClient, updateClient, getClientById } from '../services/clientService';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, CardHeader } from '../design-system';
import { Save } from 'lucide-react';

export default function ClientForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    industry: '',
    description: '',
  });

  const isEditing = !!id;

  const loadClient = useCallback(async (clientId: string) => {
    try {
      const client = await getClientById(clientId);
      if (client) {
        setFormData({
          name: client.name,
          contactEmail: client.contactEmail,
          industry: client.industry,
          description: client.description,
        });
      }
    } catch (error) {
      console.error('Error loading client:', error);
      alert('Failed to load client');
      navigate('/clients');
    }
  }, [navigate]);

  useEffect(() => {
    if (isEditing && id) {
      loadClient(id);
    }
  }, [isEditing, id, loadClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (isEditing && id) {
        await updateClient(id, formData);
      } else {
        await createClient(formData, user.uid);
      }
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AppShell
      title={isEditing ? 'Edit client' : 'New client'}
      subtitle={
        isEditing
          ? 'Update key details, contacts, and industry context for this organization.'
          : 'Capture organization context to unlock tailored assessment playbooks.'
      }
      actions={
        <Button variant="secondary" onClick={() => navigate('/clients')}>
          Cancel
        </Button>
      }
      userEmail={user?.email ?? null}
    >
      <Card padding="lg" className="max-w-3xl">
        <CardHeader
          title="Organization details"
          subtitle="These fields help the AI tailoring engine recommend benchmarks and playbooks."
        />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
              Client name <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mt-1">
              Used in reports, communications, and secure portals.
            </p>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-indigo-100"
              placeholder="e.g., Acme Corporation"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-semibold text-slate-700">
              Primary contact email <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mt-1">Used for notifications, approvals, and client portal access.</p>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              required
              value={formData.contactEmail}
              onChange={handleChange}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-indigo-100"
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-semibold text-slate-700">
              Industry <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mt-1">Helps recommend the right compliance templates and benchmarks.</p>
            <input
              type="text"
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleChange}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-indigo-100"
              placeholder="Technology, Healthcare, Finance…"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
              Organization notes
            </label>
            <p className="text-xs text-slate-500 mt-1">Optional narrative or context for your delivery team.</p>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-indigo-100"
              placeholder="Share nuances about teams, regions, or transformation goals."
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="inline-flex items-center"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2 text-sm">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Saving…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm">
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Update client' : 'Create client'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
