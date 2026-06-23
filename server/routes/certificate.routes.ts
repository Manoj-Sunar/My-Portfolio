import { Router } from 'express';
import { certificateController } from '../controllers/certificate.controller.js';
import { validate } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/auth.js';
import { createCertificateDtoRules } from '../validations/certificate.validation.js';


const certificateRoutes = Router();

// Public routes
certificateRoutes.get('/', certificateController.getAllCertificates);
certificateRoutes.get('/:id', certificateController.getCertificateById);

// Protected routes
certificateRoutes.post('/', authMiddleware, validate(createCertificateDtoRules), certificateController.createCertificate);
certificateRoutes.patch('/:id', authMiddleware, certificateController.updateCertificate);
certificateRoutes.delete('/:id', authMiddleware, certificateController.deleteCertificate);

export default certificateRoutes;
