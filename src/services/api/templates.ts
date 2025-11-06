import { createHttpClient, ApiRoutes } from './http';
import { safeApiCall } from './index';
import {
  listTemplates as localListTemplates,
  getTemplateById as localGetTemplateById,
  updateTemplateSection,
} from '../templateService';
import type { TemplateSummary, Template, TemplateSection } from '../../types';

const TEMPLATE_BASE_URL = import.meta.env.VITE_TEMPLATE_API_URL;

const templateHttp = TEMPLATE_BASE_URL ? createHttpClient(TEMPLATE_BASE_URL) : null;

export async function fetchTemplates() {
  if (!templateHttp) {
    return {
      ok: true as const,
      data: await localListTemplates(),
    };
  }
  return safeApiCall<TemplateSummary[]>(() => templateHttp<TemplateSummary[]>(ApiRoutes.templates.list));
}

export async function fetchTemplate(templateId: string) {
  if (!templateHttp) {
    return {
      ok: true as const,
      data: await localGetTemplateById(templateId),
    };
  }
  return safeApiCall<Template>(() => templateHttp<Template>(ApiRoutes.templates.detail(templateId)));
}

export async function saveTemplateSection(templateId: string, section: TemplateSection) {
  if (!templateHttp) {
    await updateTemplateSection(templateId, section);
    return { ok: true as const };
  }
  return safeApiCall(() =>
    templateHttp<void>(ApiRoutes.templates.updateSection(templateId, section.id), {
      method: 'PUT',
      body: section,
    }),
  );
}
