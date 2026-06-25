import Redis from 'ioredis';

// Inline simple in-memory TTL cache fallback for maximum resilience
class MemoryCacheClient {
  private cache = new Map<string, { value: string; expiresAt: number | null }>();

  public async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiresAt !== null && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiresAt });
  }

  public async del(keyOrKeys: string | string[]): Promise<void> {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    for (const key of keys) {
      this.cache.delete(key);
    }
  }

  public async keys(pattern: string): Promise<string[]> {
    const regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
    const regex = new RegExp(regexStr);
    const matchedKeys: string[] = [];
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt !== null && now > item.expiresAt) {
        this.cache.delete(key);
        continue;
      }
      if (regex.test(key)) {
        matchedKeys.push(key);
      }
    }
    return matchedKeys;
  }
}

class RedisCacheManager {
  private redis: Redis | null = null;
  private memoryFallback: MemoryCacheClient;
  private useFallback = true;
  private connectionAttempted = false;

  constructor() {
    this.memoryFallback = new MemoryCacheClient();
    this.initializeRedis();
  }

  private initializeRedis() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      console.log('[Redis Cache] REDIS_URL not configured. Utilizing robust in-memory fallback cache.');
      this.useFallback = true;
      return;
    }

    if (this.connectionAttempted) {
      return;
    }
    this.connectionAttempted = true;

    try {
      console.log(`[Redis Cache] Attempting connection to Redis environment...`);
      this.redis = new Redis(redisUrl, {
        lazyConnect: true,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        connectTimeout: 10000,

        retryStrategy(times: any) {
          if (times > 5) {
            console.warn("[Redis Cache] Maximum retries reached.");
            return null;
          }

          return Math.min(times * 500, 5000);
        }
      });

      this.redis.on('connect', () => {
        console.log('[Redis Cache] Successfully connected to Redis database.');
        this.useFallback = false;
      });

      this.redis.on('error', (err: any) => {
        console.error('[Redis Cache] Error encountered:', err.message);
        this.useFallback = true;
      });
    } catch (err) {
      console.error('[Redis Cache] Initialization failed:', err);
      this.useFallback = true;
    }
  }

  public async get(key: string): Promise<string | null> {
    if (this.useFallback || !this.redis) {
      return this.memoryFallback.get(key);
    }
    try {
      return await this.redis.get(key);
    } catch (err) {
      console.error(`[Redis] Error during GET standard key ${key}:`, err);
      return this.memoryFallback.get(key);
    }
  }

  public async set(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
    if (this.useFallback || !this.redis) {
      await this.memoryFallback.set(key, value, ttlSeconds);
      return;
    }
    try {
      await this.redis.set(key, value, 'EX', ttlSeconds);
    } catch (err) {
      console.error(`[Redis] Error during SET standard key ${key}:`, err);
      await this.memoryFallback.set(key, value, ttlSeconds);
    }
  }

  public async del(keyOrKeys: string | string[]): Promise<void> {
    if (this.useFallback || !this.redis) {
      await this.memoryFallback.del(keyOrKeys);
      return;
    }
    try {
      const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (err) {
      console.error('[Redis] Error during DEL keys:', err);
      await this.memoryFallback.del(keyOrKeys);
    }
  }

  public async invalidatePattern(pattern: string): Promise<void> {
    console.log(`[Cache Invalidation] Invalidating all cache keys matching pattern: "${pattern}"`);
    if (this.useFallback || !this.redis) {
      const keys = await this.memoryFallback.keys(pattern);
      if (keys.length > 0) {
        await this.memoryFallback.del(keys);
      }
      return;
    }

    try {
      let cursor = '0';
      const keysToDelete: string[] = [];

      do {
        const reply = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = reply[0];
        keysToDelete.push(...reply[1]);
      } while (cursor !== '0');

      if (keysToDelete.length > 0) {
        await this.redis.del(...keysToDelete);
        console.log(`[Cache Invalidation] Successfully removed ${keysToDelete.length} matching entries.`);
      }
    } catch (err) {
      console.error(`[Redis] Pattern invalidation error for "${pattern}":`, err);
      const keys = await this.memoryFallback.keys(pattern);
      if (keys.length > 0) {
        await this.memoryFallback.del(keys);
      }
    }
  }
}

export const redisCache = new RedisCacheManager();