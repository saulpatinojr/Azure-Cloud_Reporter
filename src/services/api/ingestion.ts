import { ApiRoutes, http } from './http';
import { safeApiCall } from './index';
import type { ApiResult } from './index';

type ValidationResult = {
  status: 'valid' | 'warning' | 'error';
  message?: string;
  suggestedTemplate?: string;
};

type UploadJob = {
  jobId: string;
  status: 'queued' | 'processing' | 'completed';
};

const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);

export async function validateUpload(file: File): Promise<ApiResult<ValidationResult>> {
  if (!hasApiBase) {
    return mockValidate(file);
  }

  const payload = new FormData();
  payload.append('file', file);

  return safeApiCall<ValidationResult>(() =>
    http<ValidationResult>(ApiRoutes.ingest.validateCsv, {
      method: 'POST',
      body: payload,
      parseJson: true,
    }),
  );
}

export async function submitUpload(file: File): Promise<ApiResult<UploadJob>> {
  if (!hasApiBase) {
    return mockUpload(file);
  }

  const payload = new FormData();
  payload.append('file', file);

  return safeApiCall<UploadJob>(() =>
    http<UploadJob>(ApiRoutes.ingest.upload, {
      method: 'POST',
      body: payload,
    }),
  );
}

async function mockValidate(file: File): Promise<ApiResult<ValidationResult>> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let status: ValidationResult['status'] = 'valid';
  let message = 'Ready for ingestion.';

  if (!extension || !['csv', 'xlsx'].includes(extension)) {
    status = 'error';
    message = 'Unsupported file type. Upload CSV or XLSX exports.';
  } else if (file.size === 0) {
    status = 'error';
    message = 'The file is empty.';
  } else if (file.size > 15 * 1024 * 1024) {
    status = 'warning';
    message = 'Large file detected. Ingestion may take longer than usual.';
  }

  return {
    ok: status !== 'error',
    data: { status, message, suggestedTemplate: extension === 'csv' ? 'RVTools Import' : 'Azure Advisor Export' },
  };
}

async function mockUpload(_file: File): Promise<ApiResult<UploadJob>> {
  const job: UploadJob = {
    jobId: `mock-${Date.now()}`,
    status: 'queued',
  };

  await new Promise((resolve) => setTimeout(resolve, 600));

  return { ok: true, data: job };
}
