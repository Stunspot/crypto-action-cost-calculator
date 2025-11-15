/**
 * Very simple TTL cache for API responses.  It stores keyed entries in memory
 * with an expiry time.  The orchestrator uses this to avoid redundant
 * network calls when the same request is made repeatedly within a short
 * period.  In a real application you might persist cache entries to
 * IndexedDB or use a more sophisticated eviction policy.
 */
export class CacheManager<K, V> {
  private ttl: number;
  private cache: Map<K, { value: V; expires: number }>;

  constructor(ttlSeconds: number) {
    this.ttl = ttlSeconds;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    this.cache.set(key, { value, expires: Date.now() + this.ttl * 1000 });
  }
}