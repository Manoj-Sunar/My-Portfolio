import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { authService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { invalidatePortfolioCache } from '../utils/cacheHelper.js';


export class AuthController {
  public login = catchAsync(async (req: any, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  });

  public getMe = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const profile = authService.getAdminProfile();
    res.status(200).json(profile);
  });

  public updateProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const updatedProfile = authService.updateProfile(req.body);
    await invalidatePortfolioCache();
    res.status(200).json({
      message: 'Profile updated successfully',
      admin: updatedProfile
    });
  });

  public changePassword = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    authService.changePassword(currentPassword, newPassword);
    res.status(200).json({ message: 'Password change successful' });
  });

  public forgotPassword = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.body;
    const result = await authService.requestForgotPasswordOTP(email);
    res.status(200).json(result);
  });

  public verifyOTP = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { email, otp } = req.body;
    const resetToken = authService.verifyOTP(email, otp);
    res.status(200).json({
      success: true,
      token: resetToken,
      message: 'Email identity confirmed successfully. You may now update your administrative password.'
    });
  });

  public resetPassword = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { token, password } = req.body;
    authService.resetPassword(token, password);
    res.status(200).json({
      message: 'Password changed successfully! You may now sign in using your new credentials.'
    });
  });
}
export const authController = new AuthController();
