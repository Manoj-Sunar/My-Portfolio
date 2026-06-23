import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

// Memory storage keeps files in buffer before uploading
const storage = multer.memoryStorage();

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid folder pattern or file format. Supported styles: JPEG, PNG, WEBP, GIF.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// Configure Cloudinary dynamically if credentials exist
const isCloudinaryConfigured = (): boolean => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload a file from memory buffer to Cloudinary or local assets space.
 */
export const uploadFile = async (
  file: Express.Multer.File,
  folder = 'portfolio'
): Promise<{ url: string; publicId: string }> => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload returned undefined result'));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    // Local fallback logic
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    // Relational URL that links back to Express static path
    const url = `/uploads/${filename}`;
    return {
      url,
      publicId: `local_${uniqueSuffix}`,
    };
  }
};

/**
 * Delete a file from Cloudinary or local files
 */
export const deleteFile = async (publicId: string): Promise<boolean> => {
  if (!publicId) return true;

  if (publicId.startsWith('local_')) {
    try {
      const filename = publicId.substring(6); // remove 'local_' prefix
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Let's look for files starting with this suffix
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        const targetFile = files.find(f => f.startsWith(filename));
        if (targetFile) {
          fs.unlinkSync(path.join(uploadsDir, targetFile));
        }
      }
      return true;
    } catch (err) {
      console.error('[Upload System] Local delete error:', err);
      return false;
    }
  }

  if (isCloudinaryConfigured()) {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === 'ok';
    } catch (error) {
      console.error('[Cloudinary System] Delete error:', error);
      return false;
    }
  }

  return true;
};

/**
 * Replace an existing file
 */
export const updateFile = async (
  oldPublicId: string,
  newFile: Express.Multer.File,
  folder = 'portfolio'
): Promise<{ url: string; publicId: string }> => {
  if (oldPublicId) {
    await deleteFile(oldPublicId);
  }
  return uploadFile(newFile, folder);
};
