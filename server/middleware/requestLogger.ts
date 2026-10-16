import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    // Skip health checks to reduce noise
    if (req.path === '/health' || req.path === '/api/health') return;
    console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
};