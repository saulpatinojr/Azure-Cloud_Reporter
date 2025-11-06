import { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, CardHeader, Badge } from '../design-system';
import type { TemplateSummary } from '../types';
import { fetchTemplates } from '../services/api/templates';
import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await fetchTemplates();
      if (result.ok && result.data) {
        setTemplates(result.data);
      }
      setLoading(false);
    })();
  }, []);

  const actions = (
    <Button onClick={() => navigate('/templates/new')}>
      Create template
    </Button>
  );

  return (
    <AppShell
      title="Template library"
      subtitle="Curate AI-ready narratives, visualizations, and reusable report sections."
      actions={actions}
    >
      <Card padding="lg">
        <CardHeader
          title="Templates"
          subtitle="Each template bundles prompts, variables, and visualization guidelines."
        />
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading templates…</div>
        ) : templates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
            No templates yet. Create your first assessment template to begin.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <article
                key={template.id}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                onClick={() => navigate(`/templates/${template.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{template.name}</h3>
                    <p className="text-sm text-slate-500">{template.category}</p>
                  </div>
                  <Badge variant={template.status === 'published' ? 'success' : 'primary'}>
                    {template.status}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                  <span>{template.sectionsCount} sections</span>
                  <span>v{template.version}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}
