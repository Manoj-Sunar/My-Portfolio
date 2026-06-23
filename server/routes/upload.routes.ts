import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadController } from '../controllers/upload.controller.js';


const uploadRoutes = Router();

// Protected route
uploadRoutes.post('/', authMiddleware, upload.single('file'), uploadController.uploadFile);

export default uploadRoutes;
