import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { AuthenticatedRequest } from '../types/index.js';
import { CACHE_KEYS } from '../utils/cacheHelper.js';
import { redisCache } from '../utils/redis.js';
import { dashboardService } from '../services/dashboard.service.js';


export class DashboardController {
  public getStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const cacheKey = CACHE_KEYS.DASHBOARD_STATS;
    const cached = await redisCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const stats = dashboardService.getStats();
    // Cache for 10 minutes (dashboard stats are short-lived cache but invalidated on edit)
    await redisCache.set(cacheKey, JSON.stringify(stats), 600);
    res.status(200).json(stats);
  });
}
export const dashboardController = new DashboardController();

