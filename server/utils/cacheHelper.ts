import { redisCache } from "./redis.js";

export const CACHE_KEYS = {
  PORTFOLIO: 'portfolio:data',
  DASHBOARD_STATS: 'dashboard:stats',
  PROJECTS_ALL: (search?: string, category?: string) => 
    `projects:all?search=${search || ''}&category=${category || ''}`,
  PROJECT_SINGLE: (id: string) => `projects:single:${id}`,
  EDUCATION_ALL: 'education:all',
  EDUCATION_SINGLE: (id: string) => `education:single:${id}`,
  CERTIFICATES_ALL: 'certificates:all',
  CERTIFICATE_SINGLE: (id: string) => `certificates:single:${id}`,
  ABOUT: 'about:data',
  CV: 'cv:data',
};

export const invalidatePortfolioCache = async (): Promise<void> => {
  console.log('[Cache Cleanup] Executing full portfolio cache invalidation...');
  try {
    await Promise.all([
      redisCache.del(CACHE_KEYS.PORTFOLIO),
      redisCache.del(CACHE_KEYS.DASHBOARD_STATS),
      redisCache.del(CACHE_KEYS.EDUCATION_ALL),
      redisCache.del(CACHE_KEYS.ABOUT),
      redisCache.del(CACHE_KEYS.CV),
      redisCache.invalidatePattern('projects:*'),
      redisCache.invalidatePattern('education:*'),
      redisCache.invalidatePattern('certificates:*')
    ]);
    console.log('[Cache Cleanup] Portfolio cache successfully invalidated.');
  } catch (err) {
    console.error('[Cache Cleanup Error] Failed to invalidate cache:', err);
  }
};