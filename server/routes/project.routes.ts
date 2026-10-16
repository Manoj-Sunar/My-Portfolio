import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  createProjectDtoRules,
  reorderProjectsDtoRules,
} from '../validations/project.validation.js';

const projectRoutes = Router();

// Public
projectRoutes.get('/', projectController.getAllProjects);

// Protected — SPECIFIC routes BEFORE parameterized routes
projectRoutes.post('/reorder', authMiddleware, validate(reorderProjectsDtoRules), projectController.reorderProjects);
projectRoutes.post('/', authMiddleware, validate(createProjectDtoRules), projectController.createProject);

// Parameterized LAST
projectRoutes.get('/:id', projectController.getProjectById);
projectRoutes.patch('/:id', authMiddleware, projectController.updateProject);
projectRoutes.delete('/:id', authMiddleware, projectController.deleteProject);

export default projectRoutes;