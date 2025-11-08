import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Badge, Button, Card, CardHeader } from '../design-system';
import type { Template, TemplateSection } from '../types';
import { fetchTemplate, saveTemplateSection } from '../services/api/templates';
import { generateSection } from '../services/api/ai';
import type { TextareaHTMLAttributes } from 'react';

export default function TemplateBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [draftSections, setDraftSections] = useState<Record<string, TemplateSection>>({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const result = await fetchTemplate(id);
      if (result.ok && result.data) {
        setTemplate(result.data);
        const clones = Object.fromEntries(result.data.sections.map((section: TemplateSection) => [section.id, { ...section }]));
        setDraftSections(clones);
        setActiveSectionId(result.data.sections[0]?.id ?? null);
      }
      setLoading(false);
    })();
  }, [id]);

  const activeSection = useMemo(() => {
    if (!activeSectionId) return null;
    return draftSections[activeSectionId];
  }, [activeSectionId, draftSections]);

  const handleChange = (sectionId: string, field: keyof TemplateSection, value: unknown) => {
    setDraftSections((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
      },
    }));
  };

  const handleVariableChange = (sectionId: string, index: number, key: 'label' | 'description' | 'source', value: string) => {
    setDraftSections((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        variables: prev[sectionId].variables.map((variable, idx) =>
          idx === index ? { ...variable, [key]: value } : variable,
        ),
      },
    }));
  };

  const handleSave = async () => {
    if (!template || !activeSection) return;
    setSaving(true);
    await saveTemplateSection(template.id, activeSection);
    setSaving(false);
  };

  const handlePreview = async () => {
    if (!template || !activeSection) return;
    setPreviewLoading(true);
    setPreviewError(null);
    const result = await generateSection({
      templateId: template.id,
      sectionId: activeSection.id,
      prompt: activeSection.prompt,
      variables: activeSection.variables.map((variable) => ({
        key: variable.key,
        value: variable.sampleValue ?? `[sample ${variable.key}]`,
      })),
    });
    setPreviewLoading(false);
    if (result.ok && result.data) {
      setPreview(result.data.content);
    } else {
      setPreviewError(result.error ?? 'Failed to generate preview');
    }
  };

  if (loading) {
    return (
      <AppShell title="Template builder" subtitle="Loading template…">
        <div className="py-10 text-sm text-slate-500">Loading template…</div>
      </AppShell>
    );
  }

  if (!template) {
    return (
      <AppShell title="Template builder" subtitle="Template not found.">
        <div className="py-10 text-sm text-slate-500">Template not found.</div>
      </AppShell>
    );
  }

  const actions = (
    <div className="flex items-center gap-3">
      <Button variant="secondary" onClick={() => navigate('/templates')}>
        Back to library
      </Button>
      <Button variant="ghost" onClick={handlePreview} disabled={!activeSection || previewLoading}>
        {previewLoading ? 'Generating…' : 'Preview AI draft'}
      </Button>
      <Button disabled={!activeSection || saving} onClick={handleSave}>
        {saving ? 'Saving…' : 'Save section'}
      </Button>
    </div>
  );

  return (
    <AppShell
      title={template.name}
      subtitle={`Configure prompts and variables for ${template.sections.length} sections.`}
      actions={actions}
    >
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card padding="lg" className="h-fit">
          <CardHeader title="Sections" subtitle="Select a section to edit." />
          <div className="space-y-2">
            {template.sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  section.id === activeSectionId
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 bg-white hover:border-primary/40'
                }`}
              >
                <p className="font-semibold">{section.title}</p>
                <p className="text-xs text-slate-500">Prompt tokens: {section.prompt.length}</p>
              </button>
            ))}
          </div>
        </Card>

        {activeSection ? (
          <Card padding="lg" className="space-y-6">
            <SectionHeader section={activeSection} />
            <div className="space-y-4">
              <fieldset className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="section-title">
                  Section title
                </label>
                <input
                  id="section-title"
                  value={activeSection.title}
                  onChange={(event) => handleChange(activeSection.id, 'title', event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-indigo-100"
                />
              </fieldset>

              <fieldset className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="section-description">
                  Description
                </label>
                <ResizingTextarea
                  id="section-description"
                  value={activeSection.description ?? ''}
                  onChange={(event) => handleChange(activeSection.id, 'description', event.target.value)}
                  placeholder="Describe the purpose of this section for collaborators."
                />
              </fieldset>

              <fieldset className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="section-prompt">
                  Prompt template
                </label>
                <ResizingTextarea
                  id="section-prompt"
                  value={activeSection.prompt}
                  onChange={(event) => handleChange(activeSection.id, 'prompt', event.target.value)}
                  placeholder="Write the prompt the AI orchestrator will use."
                  minRows={6}
                />
                <p className="text-xs text-slate-500">
                  Use handlebars-style variables (e.g. <code>{'{{variable_key}}'}</code>). Variables defined below should match.
                </p>
              </fieldset>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Variables</h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      handleChange(activeSection.id, 'variables', [
                        ...activeSection.variables,
                        { key: `var_${activeSection.variables.length + 1}`, label: 'New variable', source: 'manual' },
                      ]);
                    }}
                  >
                    Add variable
                  </Button>
                </div>
                <div className="space-y-3">
                  {activeSection.variables.map((variable, index) => (
                    <Card key={variable.key} padding="sm" className="border-slate-200 bg-slate-50">
                      <div className="grid gap-3 md:grid-cols-2">
                        <fieldset className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Label</label>
                          <input
                            title="Variable label"
                            placeholder="Variable label"
                            value={variable.label}
                            onChange={(event) => handleVariableChange(activeSection.id, index, 'label', event.target.value)}
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                          />
                        </fieldset>
                        <fieldset className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Source</label>
                          <select
                            title="Variable source"
                            value={variable.source ?? 'manual'}
                            onChange={(event) => handleVariableChange(activeSection.id, index, 'source', event.target.value)}
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                          >
                            <option value="ingestion">Ingestion data</option>
                            <option value="manual">Manual input</option>
                            <option value="ai">AI generated</option>
                          </select>
                        </fieldset>
                      </div>
                      <fieldset className="mt-3 space-y-1">
                        <label className="text-xs font-medium text-slate-600">Description</label>
                        <ResizingTextarea
                          value={variable.description ?? ''}
                          onChange={(event) => handleVariableChange(activeSection.id, index, 'description', event.target.value)}
                          placeholder="Explain how this variable is used."
                          minRows={2}
                        />
                      </fieldset>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800">AI preview</h3>
                <Card padding="md" className="bg-slate-50 text-sm text-slate-700">
                  {previewLoading ? (
                    <p>Generating preview…</p>
                  ) : previewError ? (
                    <p className="text-rose-600">{previewError}</p>
                  ) : preview ? (
                    <pre className="whitespace-pre-wrap font-sans text-sm">{preview}</pre>
                  ) : (
                    <p className="text-slate-500">Run “Preview AI draft” to see sample output using placeholder values.</p>
                  )}
                </Card>
              </section>
            </div>
          </Card>
        ) : (
          <Card padding="lg" className="flex items-center justify-center text-sm text-slate-500">
            Select a section to start editing.
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function SectionHeader({ section }: { section: TemplateSection }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
        <p className="text-sm text-slate-500">
          Configure the narrative prompt and variable requirements for this stage.
        </p>
      </div>
      <Badge variant="primary">{section.visualization ?? 'text'}</Badge>
    </div>
  );
}

type ResizingTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  minRows?: number;
};

function ResizingTextarea({ minRows = 3, ...props }: ResizingTextareaProps) {
  return (
    <textarea
      {...props}
      rows={minRows}
      className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-indigo-100 ${props.className ?? ''}`}
    />
  );
}
