const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

type RequestOptions = Omit<RequestInit, 'body'> & {
  parseJson?: boolean;
  body?: any;
};

export async function http<T = unknown>(path: string, options: RequestOptions = {}, baseUrl: string = API_BASE_URL): Promise<T> {
  const { parseJson = true, headers = {}, body, ...rest } = options;

  const isFormData = body instanceof FormData;
  const finalHeaders = new Headers(headers as HeadersInit);

  let finalBody: RequestInit['body'] = body;

  if (!isFormData) {
    if (!finalHeaders.has('Content-Type')) {
      finalHeaders.set('Content-Type', 'application/json');
    }

    if (body && typeof body !== 'string') {
      finalBody = JSON.stringify(body);
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    credentials: 'include',
    headers: finalHeaders,
    body: finalBody,
    ...rest,
  });

  if (!response.ok) {
    const errorText = await safeParseError(response);
    throw new Error(errorText || `API request failed with status ${response.status}`);
  }

  if (!parseJson) {
    // @ts-expect-error - caller expects a non-JSON payload
    return response;
  }

  return (await response.json()) as T;
}

async function safeParseError(response: Response) {
  try {
    const data = await response.json();
    return data?.error || data?.message || JSON.stringify(data);
  } catch (error) {
    console.warn('Failed to parse error body', error);
    return response.statusText;
  }
}

export const ApiRoutes = {
  ingest: {
    validateCsv: '/ingest/validate/csv',
    upload: '/ingest/upload',
  },
  ai: {
    generateNarrative: '/generate',
  },
  templates: {
    list: '/templates',
    detail: (id: string) => `/templates/${id}`,
    updateSection: (templateId: string, sectionId: string) => `/templates/${templateId}/sections/${sectionId}`,
  },
} as const;

export const httpFactories = {
  ingestion: API_BASE_URL ? <T = unknown>(path: string, options?: RequestOptions) => http<T>(path, options) : null,
  template(baseUrl: string) {
    return <T = unknown>(path: string, options?: RequestOptions) => http<T>(path, options, baseUrl);
  },
  ai(baseUrl: string) {
    return <T = unknown>(path: string, options?: RequestOptions) => http<T>(path, options, baseUrl);
  },
};

export function createHttpClient(baseUrl?: string) {
  return <T = unknown>(path: string, options?: RequestOptions) => http<T>(path, options, baseUrl ?? API_BASE_URL);
}

// Note: `safeApiCall` is implemented in `services/api/index.ts` which re-exports this module.
