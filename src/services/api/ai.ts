import { createHttpClient, ApiRoutes, safeApiCall } from './http';

const AI_BASE_URL = import.meta.env.VITE_AI_API_URL;
const aiHttp = AI_BASE_URL ? createHttpClient(AI_BASE_URL) : null;

type GenerateRequest = {
  templateId: string;
  sectionId: string;
  prompt: string;
  variables: Array<{ key: string; value: string }>;
};

type GenerateResponse = {
  job_id: string;
  content: string;
  tokens_used: number;
  grounded_references: string[];
};

export async function generateSection(request: GenerateRequest) {
  if (!aiHttp) {
    const mockContent = request.prompt.replace(/{{(.*?)}}/g, (_, key) => {
      const variable = request.variables.find((item) => item.key === key.trim());
      return variable?.value ?? `[${key}]`;
    });
    return {
      ok: true as const,
      data: {
        job_id: 'mock-job-local',
        content: `Mock narrative for ${request.sectionId}\n\n${mockContent}`,
        tokens_used: mockContent.split(' ').length,
        grounded_references: request.variables.map((variable) => variable.key),
      } satisfies GenerateResponse,
    };
  }

  return safeApiCall<GenerateResponse>(() =>
    aiHttp(ApiRoutes.ai.generateNarrative, {
      method: 'POST',
      body: {
        template_id: request.templateId,
        section_id: request.sectionId,
        prompt: request.prompt,
        variables: request.variables,
      },
    }),
  );
}
