import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { CACHE_KEYS, invalidatePortfolioCache } from '../utils/cacheHelper.js';
import { redisCache } from '../utils/redis.js';
import { certificateService } from '../services/certificate.service.js';
import { AuthenticatedRequest } from '../types/index.js';


export class CertificateController {
  public getAllCertificates = catchAsync(async (req: any, res: Response) => {
    const cacheKey = CACHE_KEYS.CERTIFICATES_ALL;
    const cached = await redisCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const certificates = certificateService.getAllCertificates();
    await redisCache.set(cacheKey, JSON.stringify(certificates), 3600);
    res.status(200).json(certificates);
  });

  public getCertificateById = catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;
    const cacheKey = CACHE_KEYS.CERTIFICATE_SINGLE(id);
    const cached = await redisCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const cert = certificateService.getCertificateById(id);
    await redisCache.set(cacheKey, JSON.stringify(cert), 3600);
    res.status(200).json(cert);
  });

  public createCertificate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const newCert = certificateService.createCertificate(req.body);
    await invalidatePortfolioCache();
    res.status(201).json(newCert);
  });

  public updateCertificate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updatedCert = certificateService.updateCertificate(id, req.body);
    await invalidatePortfolioCache();
    res.status(200).json(updatedCert);
  });

  public deleteCertificate = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    certificateService.deleteCertificate(id);
    await invalidatePortfolioCache();
    res.status(200).json({ message: 'Certificate record deleted successfully' });
  });
}
export const certificateController = new CertificateController();

