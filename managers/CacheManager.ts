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
	 * Get cached value or null
	 * @param key Cache key
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
	 * Set a cached value
	 * @param key Cache key
	 * @param value Value to cache
	 * @param ttlSeconds TTL in seconds
	 */

	static async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
		store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
	}

	/**
	 * Invalidate cache entry
	 * @param key Cache key
	 */

	static async invalidate(key: string): Promise<void> {
		store.delete(key);
	}

	/**
	 * Invalidate by key prefix
	 * @param pattern Key prefix
	 */

	static async invalidatePattern(pattern: string): Promise<void> {
		for (const key of store.keys()) {
			if (key.startsWith(pattern)) store.delete(key);
		}
	}
}
