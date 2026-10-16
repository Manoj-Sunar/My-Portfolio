import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { CACHE_KEYS, invalidatePortfolioCache } from '../utils/cacheHelper.js';
import { redisCache } from '../utils/redis.js';
import { cvService } from '../services/cv.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class CVController {
  public getCV = catchAsync(async (_req: any, res: Response) => {
    const cacheKey = CACHE_KEYS.CV;
    const cached = await redisCache.get(cacheKey);
    if (cached) {
      try {
        return res.status(200).json(JSON.parse(cached));
      } catch {
        /* fall through */
      }
    }

    const cv = cvService.getCV();
    await redisCache.set(cacheKey, JSON.stringify(cv), 3600);
    res.status(200).json(cv);
  });

  public updateCV = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const updated = cvService.updateCV(req.body);
    await invalidatePortfolioCache();
    res.status(200).json({ message: 'CV updated successfully', cv: updated });
  });

  public resetTheme = catchAsync(async (_req: AuthenticatedRequest, res: Response) => {
    const theme = cvService.resetTheme();
    await invalidatePortfolioCache();
    res.status(200).json({ message: 'CV theme reset', theme });
  });

  public recordDownload = catchAsync(async (_req: any, res: Response) => {
    const meta = cvService.incrementDownloads();
    await redisCache.del(CACHE_KEYS.CV);
    res.status(200).json(meta);
  });
}

export const cvController = new CVController();