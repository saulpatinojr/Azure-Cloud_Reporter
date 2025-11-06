export * from './http';

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function safeApiCall<T>(call: () => Promise<T>): Promise<ApiResult<T>> {
  try {
    const data = await call();
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    return { ok: false, error: message };
  }
}
