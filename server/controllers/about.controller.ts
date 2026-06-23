import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { CACHE_KEYS, invalidatePortfolioCache } from '../utils/cacheHelper.js';
import { redisCache } from '../utils/redis.js';
import { aboutService } from '../services/about.service.js';
import { AuthenticatedRequest } from '../types/index.js';


export class AboutController {
  public getAbout = catchAsync(async (req: any, res: Response) => {
    const cacheKey = CACHE_KEYS.ABOUT;
    const cached = await redisCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const about = aboutService.getAbout();
    await redisCache.set(cacheKey, JSON.stringify(about), 3600);
    res.status(200).json(about);
  });

  public updateAbout = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const updatedAbout = aboutService.updateAbout(req.body);
    await invalidatePortfolioCache();
    res.status(200).json({
      message: 'About section updated successfully',
      about: updatedAbout
    });
  });
}
export const aboutController = new AboutController();

