import Redis from "ioredis";

// --------------------
// Memory Fallback Cache
// --------------------
class MemoryCacheClient {
  private cache = new Map<
    string,
    { value: string; expiresAt: number | null }
  >();

  async get(key: string): Promise<string |null> {
    const item = this.cache.get(key);

    if (!item) return null;

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(
    key: string,
    value: string,
    ttlSeconds?: number
  ): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: ttlSeconds
        ? Date.now() + ttlSeconds * 1000
        : null,
    });
  }

  async del(keys: string | string[]): Promise<void> {
    const arr = Array.isArray(keys) ? keys : [keys];

    arr.forEach((key) => this.cache.delete(key));
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(
      "^" + pattern.replace(/\*/g, ".*") + "$"
    );

    const now = Date.now();
    const matched: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.cache.delete(key);
        continue;
      }

      if (regex.test(key)) matched.push(key);
    }

    return matched;
  }
}

// --------------------
// Redis Manager
// --------------------

class RedisCacheManager {
  private redis: Redis | null = null;

  private memory = new MemoryCacheClient();

  private useFallback = true;

  async initialize() {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      console.warn(
        "[Redis] REDIS_URL missing. Using in-memory cache."
      );
      return;
    }

    try {
      console.log("[Redis] Connecting...");

      this.redis = new Redis(redisUrl, {
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        connectTimeout: 10000,

        retryStrategy(times:any) {
          if (times > 5) {
            console.error("[Redis] Retry limit exceeded.");
            return null;
          }

          return Math.min(times * 500, 5000);
        },
      });

      this.redis.on("connect", () => {
        console.log("✅ Redis TCP connected");
      });

      this.redis.on("ready", () => {
        console.log("✅ Redis ready");
        this.useFallback = false;
      });

      this.redis.on("error", (err:any) => {
        console.error("❌ Redis error:", err.message);
        this.useFallback = true;
      });

      this.redis.on("close", () => {
        console.warn("Redis connection closed.");
        this.useFallback = true;
      });

      await this.redis.ping();

      console.log("✅ Redis ping successful.");

      this.useFallback = false;
    } catch (err) {
      console.error(
        "[Redis] Initialization failed. Using memory cache.",
        err
      );

      this.useFallback = true;
    }
  }

  async get(key: string) {
    if (this.useFallback || !this.redis) {
      return this.memory.get(key);
    }

    try {
      return await this.redis.get(key);
    } catch {
      return this.memory.get(key);
    }
  }

  async set(
    key: string,
    value: string,
    ttl = 3600
  ) {
    if (this.useFallback || !this.redis) {
      return this.memory.set(key, value, ttl);
    }

    try {
      await this.redis.set(key, value, "EX", ttl);
    } catch {
      await this.memory.set(key, value, ttl);
    }
  }

  async del(keys: string | string[]) {
    if (this.useFallback || !this.redis) {
      return this.memory.del(keys);
    }

    const arr = Array.isArray(keys)
      ? keys
      : [keys];

    if (arr.length) {
      await this.redis.del(...arr);
    }
  }

  async invalidatePattern(pattern: string) {
    if (this.useFallback || !this.redis) {
      const keys = await this.memory.keys(pattern);

      if (keys.length) {
        await this.memory.del(keys);
      }

      return;
    }

    let cursor = "0";

    do {
      const [nextCursor, keys] =
        await this.redis.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100
        );

      cursor = nextCursor;

      if (keys.length) {
        await this.redis.del(...keys);
      }
    } while (cursor !== "0");
  }
}

export const redisCache = new RedisCacheManager();