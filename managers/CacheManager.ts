/** Internal cache entry with expiration timestamp */
interface CacheEntry {
	value: unknown;
	expiresAt: number;
}

const store = new Map<string, CacheEntry>();

/**
 * In-memory cache with TTL support.
 * Drop-in ready, swappable with Redis when needed.
 */
export class CacheManager {
	/**
	 * Retrieve a cached value by key, returning null if missing or expired
	 * @param key Cache key to look up
	 * @returns Cached value or null
	 */
	static async get<T>(key: string): Promise<T | null> {
		const entry = store.get(key);
		if (!entry) return null;
		if (Date.now() > entry.expiresAt) {
			store.delete(key);
			return null;
		}
		return entry.value as T;
	}

	/**
	 * Store a value in the cache with a time-to-live
	 * @param key Cache key
	 * @param value Value to cache
	 * @param ttlSeconds Time-to-live in seconds
	 */
	static async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
		store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
	}

	/**
	 * Remove a single cache entry by exact key
	 * @param key Cache key to invalidate
	 */
	static async invalidate(key: string): Promise<void> {
		store.delete(key);
	}

	/**
	 * Remove all cache entries whose key starts with the given prefix
	 * @param pattern Key prefix to match against
	 */
	static async invalidatePattern(pattern: string): Promise<void> {
		for (const key of store.keys()) {
			if (key.startsWith(pattern)) store.delete(key);
		}
	}
}
