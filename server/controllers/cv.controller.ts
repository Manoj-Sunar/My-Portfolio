import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { CACHE_KEYS, invalidatePortfolioCache } from '../utils/cacheHelper.js';
import { redisCache } from '../utils/redis.js';
import { cvService } from '../services/cv.service.js';
import { AuthenticatedRequest } from '../types/index.js';



export class CVController {
  public getCV = catchAsync(async (req: any, res: Response) => {
    const cacheKey = CACHE_KEYS.CV;
    const cached = await redisCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const cv = cvService.getCV();
    await redisCache.set(cacheKey, JSON.stringify(cv), 3600);
    res.status(200).json(cv);
  });

  public updateCV = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const updatedCV = cvService.updateCV(req.body);
    await invalidatePortfolioCache();
    res.status(200).json({
      message: 'CV Resume updated successfully',
      cv: updatedCV
    });
  });
}
export const cvController = new CVController();

