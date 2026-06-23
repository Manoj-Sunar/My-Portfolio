import { Router } from 'express';
import { aboutController } from '../controllers/about.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { updateAboutDtoRules } from '../validations/about.validation.js';


const aboutRoutes = Router();

// Public routes
aboutRoutes.get('/', aboutController.getAbout);

// Protected routes
aboutRoutes.patch('/', authMiddleware, validate(updateAboutDtoRules), aboutController.updateAbout);

export default aboutRoutes;
