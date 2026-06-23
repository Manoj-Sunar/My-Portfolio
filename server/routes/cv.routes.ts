import { Router } from 'express';
import { cvController } from '../controllers/cv.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { updateCVDtoRules } from '../validations/cv.validation.js';


const cvRoutes = Router();

// Public routes
cvRoutes.get('/', cvController.getCV);

// Protected routes
cvRoutes.patch('/', authMiddleware, validate(updateCVDtoRules), cvController.updateCV);

export default cvRoutes;
