import { Router } from 'express';
import { educationController } from '../controllers/education.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createEducationDtoRules } from '../validations/education.validation.js';


const educationRoutes = Router();

// Public routes
educationRoutes.get('/', educationController.getAllEducation);
educationRoutes.get('/:id', educationController.getEducationById);

// Protected routes
educationRoutes.post('/', authMiddleware, validate(createEducationDtoRules), educationController.createEducation);
educationRoutes.patch('/:id', authMiddleware, educationController.updateEducation);
educationRoutes.delete('/:id', authMiddleware, educationController.deleteEducation);

export default educationRoutes;
