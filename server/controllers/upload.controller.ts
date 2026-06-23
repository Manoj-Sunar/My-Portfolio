import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { AuthenticatedRequest } from '../types/index.js';
import { AppError } from '../utils/AppError.js';
import { uploadService } from '../services/upload.service.js';


export class UploadController {
  public uploadFile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      throw new AppError('No file attachment parsing completed.', 400);
    }
    const result = await uploadService.saveFile(req.file);
    res.status(200).json(result);
  });
}
export const uploadController = new UploadController();
