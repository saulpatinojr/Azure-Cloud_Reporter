// Simple in-memory volatile cache (resets on reload). Not for sensitive data.
// Provides get/set with TTL and optional stale-while-revalidate flag.
export type CacheEntry<T> = {
  value: T;
  expiresAt: number; // epoch ms
};

const store = new Map<string, CacheEntry<unknown>>();

export function setCache<T>(key: string, value: T, ttlMs = 60_000): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function getCache<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function clearCache(key?: string) {
  if (key) store.delete(key); else store.clear();
}

export function withCache<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const existing = getCache<T>(key);
  if (existing !== undefined) return Promise.resolve(existing);
  return fn().then(v => { setCache(key, v, ttlMs); return v; });
}
