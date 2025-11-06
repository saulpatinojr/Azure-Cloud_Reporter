import type { TemplateSummary, Template, TemplateSection } from '../types';
import { Timestamp } from 'firebase/firestore';

const now = Timestamp.now();

const mockTemplates: Template[] = [
  {
    id: 'template-cloudfit-readiness',
    name: 'CloudFit Readiness Narrative',
    category: 'Readiness',
    version: '1.2.0',
    status: 'draft',
    updatedAt: now,
    tags: ['AI-assisted', 'Readiness', 'Executive summary'],
    sections: [
      {
        id: 'overview',
        title: 'Executive Overview',
        description: 'High-level narrative summarizing readiness posture.',
        prompt: 'Summarize key readiness indicators for {{client_name}} using ingestion metrics and benchmarks.',
        variables: [
          { key: 'client_name', label: 'Client name', required: true, source: 'manual', sampleValue: 'Contoso Ltd.' },
          { key: 'readiness_score', label: 'Readiness score', required: true, source: 'ingestion', sampleValue: '78%' },
        ],
        visualization: 'text',
        order: 1,
      },
      {
        id: 'risk',
        title: 'Risk Drivers',
        description: 'Highlight the top risk areas requiring attention.',
        prompt: 'List top three risk drivers from ingestion dataset {{risk_dataset}} with recommended actions.',
        variables: [
          { key: 'risk_dataset', label: 'Risk dataset table', required: true, source: 'ingestion', sampleValue: 'risk_table' },
        ],
        visualization: 'table',
        order: 2,
      },
    ],
  },
  {
    id: 'template-cost-optimization',
    name: 'Cost Optimization Playbook',
    category: 'Cost',
    version: '2.0.0',
    status: 'published',
    updatedAt: now,
    tags: ['Cost', 'Azure Advisor', 'Playbook'],
    sections: [
      {
        id: 'summary',
        title: 'Optimization Summary',
        prompt: 'Create a narrative summarizing savings opportunity using {{savings_table}}.',
        variables: [
          { key: 'savings_table', label: 'Savings table', required: true, source: 'ingestion', sampleValue: 'savings_breakdown' },
        ],
        visualization: 'text',
        order: 1,
      },
    ],
  },
];

export async function listTemplates(): Promise<TemplateSummary[]> {
  return mockTemplates.map((template) => ({
    id: template.id,
    name: template.name,
    category: template.category,
    version: template.version,
    status: template.status,
    updatedAt: template.updatedAt,
    tags: template.tags,
    sectionsCount: template.sections.length,
  }));
}

export async function getTemplateById(id: string): Promise<Template | null> {
  return mockTemplates.find((template) => template.id === id) ?? null;
}

export async function updateTemplateSection(templateId: string, section: TemplateSection): Promise<void> {
  const template = mockTemplates.find((t) => t.id === templateId);
  if (!template) return;
  const index = template.sections.findIndex((s) => s.id === section.id);
  if (index >= 0) {
    template.sections[index] = section;
  }
}
