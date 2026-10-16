import { Response } from 'express';
import { CookieOptions } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { authService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { invalidatePortfolioCache } from '../utils/cacheHelper.js';
import { AUTH_COOKIE_NAME } from '../middleware/auth.js';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Cookie config.
 * - `sameSite: 'lax'` works when frontend and API share the same site (e.g. localhost:3000 → localhost:5000, or app.example.com → api.example.com).
 * - If frontend and API are on *different sites* (e.g. frontend.vercel.app → api.onrender.com), set COOKIE_SAMESITE=none in env.
 */
const sameSite = (process.env.COOKIE_SAMESITE as CookieOptions['sameSite']) || 'lax';

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,          // HTTPS-only in production
  sameSite,
  path: '/',
  ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
};

const loginCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT expiry
};

export class AuthController {
  public login = catchAsync(async (req: any, res: Response) => {
    const { email, password } = req.body;
    const { token, admin } = await authService.login(email, password);

    res.cookie(AUTH_COOKIE_NAME, token, loginCookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin,
    });
  });

  public logout = catchAsync(async (_req: any, res: Response) => {
    // clearCookie must use the same path/sameSite/secure/domain
    res.clearCookie(AUTH_COOKIE_NAME, baseCookieOptions);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  public getMe = catchAsync(async (_req: AuthenticatedRequest, res: Response) => {
    const profile = authService.getAdminProfile();
    res.status(200).json(profile);
  });

  public updateProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const updatedProfile = authService.updateProfile(req.body);
    await invalidatePortfolioCache();
    res.status(200).json({
      message: 'Profile updated successfully',
      admin: updatedProfile,
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
      message:
        'Email identity confirmed successfully. You may now update your administrative password.',
    });
  });

  public resetPassword = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { token, password } = req.body;
    authService.resetPassword(token, password);
    res.status(200).json({
      message: 'Password changed successfully! You may now sign in using your new credentials.',
    });
  });
}

export const authController = new AuthController();