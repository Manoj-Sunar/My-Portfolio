import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import educationRoutes from './education.routes.js';
import certificateRoutes from './certificate.routes.js';
import aboutRoutes from './about.routes.js';
import cvRoutes from './cv.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import portfolioRoutes from './portfolio.routes.js';
import uploadRoutes from './upload.routes.js';


const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/education', educationRoutes);
router.use('/certificates', certificateRoutes);
router.use('/about', aboutRoutes);
router.use('/cv', cvRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/upload', uploadRoutes);

export default router;
