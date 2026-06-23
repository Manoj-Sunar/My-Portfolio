import { Router } from 'express';
import { portfolioController } from '../controllers/portfolio.controller.js';

const portfolioRoutes = Router();

// Public route
portfolioRoutes.get('/', portfolioController.getPortfolioData);

export default portfolioRoutes;
