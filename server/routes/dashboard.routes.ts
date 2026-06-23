import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { dashboardController } from '../controllers/dashboard.controller.js';

const dashboardRoutes = Router();

// Protected route
dashboardRoutes.get('/', authMiddleware, dashboardController.getStats);
dashboardRoutes.get('/stats', authMiddleware, dashboardController.getStats);

export default dashboardRoutes;
