import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { CACHE_KEYS, invalidatePortfolioCache } from '../utils/cacheHelper.js';
import { educationService } from '../services/education.service.js';
import { redisCache } from '../utils/redis.js';
import { AuthenticatedRequest } from '../types/index.js';


export class EducationController {
  public getAllEducation = catchAsync(async (req: any, res: Response) => {
    const cacheKey = CACHE_KEYS.EDUCATION_ALL;
    const cached = await redisCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const education = educationService.getAllEducation();
    await redisCache.set(cacheKey, JSON.stringify(education), 3600);
    res.status(200).json(education);
  });

  public getEducationById = catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;
    const cacheKey = CACHE_KEYS.EDUCATION_SINGLE(id);
    const cached = await redisCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const edu = educationService.getEducationById(id);
    await redisCache.set(cacheKey, JSON.stringify(edu), 3600);
    res.status(200).json(edu);
  });

  public createEducation = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const newEdu = educationService.createEducation(req.body);
    await invalidatePortfolioCache();
    res.status(201).json(newEdu);
  });

  public updateEducation = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updatedEdu = educationService.updateEducation(id, req.body);
    await invalidatePortfolioCache();
    res.status(200).json(updatedEdu);
  });

  public deleteEducation = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    educationService.deleteEducation(id);
    await invalidatePortfolioCache();
    res.status(200).json({ message: 'Education record deleted successfully' });
  });
}
export const educationController = new EducationController();

