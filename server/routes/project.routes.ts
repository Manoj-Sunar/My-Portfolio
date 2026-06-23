import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createProjectDtoRules, reorderProjectsDtoRules } from '../validations/project.validation.js';


const projectRoutes = Router();

// Public routes
projectRoutes.get('/', projectController.getAllProjects);
projectRoutes.get('/:id', projectController.getProjectById);

// Protected routes
projectRoutes.post('/', authMiddleware, validate(createProjectDtoRules), projectController.createProject);
projectRoutes.post('/reorder', authMiddleware, validate(reorderProjectsDtoRules), projectController.reorderProjects);
projectRoutes.patch('/:id', authMiddleware, projectController.updateProject);
projectRoutes.delete('/:id', authMiddleware, projectController.deleteProject);

export default projectRoutes;
