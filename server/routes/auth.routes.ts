import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { changePasswordDtoRules, forgotPasswordDtoRules, loginDtoRules, resetPasswordDtoRules, updateProfileDtoRules, verifyOTPDtoRules } from '../validations/auth.validation.js';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';



const authRoutes = Router();

authRoutes.post('/login', validate(loginDtoRules), authController.login);
authRoutes.post('/forgot-password', validate(forgotPasswordDtoRules), authController.forgotPassword);
authRoutes.post('/verify-otp', validate(verifyOTPDtoRules), authController.verifyOTP);
authRoutes.post('/reset-password', validate(resetPasswordDtoRules), authController.resetPassword);

// Protected routes
authRoutes.get('/me', authMiddleware, authController.getMe);
authRoutes.patch('/profile', authMiddleware, validate(updateProfileDtoRules), authController.updateProfile);
authRoutes.patch('/change-password', authMiddleware, validate(changePasswordDtoRules), authController.changePassword);

export default authRoutes;
