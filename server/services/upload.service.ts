import { deleteFile, updateFile, uploadFile } from "../middleware/upload.js";
import { AppError } from "../utils/AppError.js";


export class UploadService {
  public async saveFile(file: Express.Multer.File, folder?: string) {
    if (!file) {
      throw new AppError('No file attachment parsed in request.', 400);
    }
    return uploadFile(file, folder);
  }

  public async removeFile(publicId: string) {
    if (!publicId) return true;
    return deleteFile(publicId);
  }

  public async replaceFile(oldPublicId: string, file: Express.Multer.File, folder?: string) {
    if (!file) {
      throw new AppError('No file attachment parsed in request.', 400);
    }
    return updateFile(oldPublicId, file, folder);
  }
}
export const uploadService = new UploadService();
