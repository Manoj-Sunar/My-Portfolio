// cv.routes.ts
import { Router } from 'express';
import { cvController } from '../controllers/cv.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { updateCVDtoRules } from '../validations/cv.validation.js';

const cvRoutes = Router();

cvRoutes.get('/', cvController.getCV);
cvRoutes.patch('/', authMiddleware, validate(updateCVDtoRules), cvController.updateCV);

export default cvRoutes;