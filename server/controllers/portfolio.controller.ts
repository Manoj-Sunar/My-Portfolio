import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { redisCache } from '../utils/redis.js';
import { CACHE_KEYS } from '../utils/cacheHelper.js';
import { portfolioService } from '../services/portfolio.service.js';

export class PortfolioController {
  public getPortfolioData = catchAsync(async (req: Request, res: Response) => {
    try {
      // Attempt cache fetch
      const cached = await redisCache.get(CACHE_KEYS.PORTFOLIO);
    

      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }

      const data = portfolioService.getPortfolioData();
      
      // Ensure data is not empty
      if (!data) {
        return res.status(404).json({ 
          message: 'Portfolio data not found. Please ensure database is properly initialized.' 
        });
      }
      
      // Set cache (1 hour duration)
      await redisCache.set(CACHE_KEYS.PORTFOLIO, JSON.stringify(data), 3600);
      
      res.status(200).json(data);
    } catch (error) {
      console.error('[Portfolio Controller] Error fetching portfolio data:', error);
      res.status(500).json({ 
        message: 'Failed to fetch portfolio data',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });
}

export const portfolioController = new PortfolioController();