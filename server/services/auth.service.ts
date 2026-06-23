import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { loadDB, logActivity, saveDB } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { AdminProfile } from '../types/index.js';
import { deleteFile } from '../middleware/upload.js';
import { sendOTPEmail } from '../utils/emailService.js';


const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-jwt-secret-key-18349';

export class AuthService {
  public async login(email: string, password: string) {
    const db = loadDB();
    const admin = db.admin;
    
    if (admin.email.toLowerCase() !== email.toLowerCase()) {
      throw new AppError('Invalid email or password combination.', 401);
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password combination.', 401);
    }

    // Generate Bearer Authorization Token
    const token = jwt.sign(
      { email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    logActivity(`Admin logged in successfully: ${admin.name}`);

    const { passwordHash, resetPasswordToken, resetPasswordExpire, resetPasswordOTP, resetPasswordOTPExpires, ...adminPublic } = admin;
    return { token, admin: adminPublic };
  }

  public getAdminProfile() {
    const db = loadDB();
    const admin = db.admin;
    const { passwordHash, resetPasswordToken, resetPasswordExpire, resetPasswordOTP, resetPasswordOTPExpires, ...adminPublic } = admin;
    return adminPublic;
  }

  public updateProfile(updates: Partial<AdminProfile>) {
    const db = loadDB();
    const admin = db.admin;

    if (updates.name) admin.name = updates.name;
    if (updates.email) admin.email = updates.email.toLowerCase();
    if (updates.bio !== undefined) admin.bio = updates.bio;
    if (updates.title !== undefined) admin.title = updates.title;
    if (updates.socialLinks) {
      admin.socialLinks = {
        ...admin.socialLinks,
        ...updates.socialLinks
      };
    }
    if (updates.profileImage) {
      if (admin.profileImage && admin.profileImage.publicId && admin.profileImage.publicId !== updates.profileImage.publicId) {
        deleteFile(admin.profileImage.publicId).catch(err =>
          console.error('[Admin Profile Service Asset Cleanup] Failed to delete old profile image:', err)
        );
      }
      admin.profileImage = updates.profileImage;
    }

    db.admin = admin;
    saveDB(db);
    logActivity('Admin profile settings updated.');

    const { passwordHash, resetPasswordToken, resetPasswordExpire, resetPasswordOTP, resetPasswordOTPExpires, ...adminPublic } = admin;
    return adminPublic;
  }

  public changePassword(current: string, next: string) {
    const db = loadDB();
    const admin = db.admin;

    const isMatch = bcrypt.compareSync(current, admin.passwordHash);
    if (!isMatch) {
      throw new AppError('The current password provided is incorrect.', 400);
    }

    const salt = bcrypt.genSaltSync(10);
    admin.passwordHash = bcrypt.hashSync(next, salt);
    
    db.admin = admin;
    saveDB(db);

    logActivity('Administrative password updated successfully.');
    return true;
  }

  public async requestForgotPasswordOTP(email: string) {
    const db = loadDB();
    const admin = db.admin;

    if (admin.email.toLowerCase() !== email.toLowerCase()) {
      return { success: true, message: 'If that email matches our system, a verification code was sent.' };
    }

    // 6-digit verification pin
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = Date.now() + 10 * 60 * 1000; // 10 mins

    admin.resetPasswordOTP = otp;
    admin.resetPasswordOTPExpires = new Date(expireTime).toISOString();
    
    db.admin = admin;
    saveDB(db);

    const sent = await sendOTPEmail({
      email: admin.email,
      otp,
      adminName: admin.name
    });

    if (!sent) {
      throw new AppError('SMTP error encountered dispatching verification pins. Please inspect your SMTP credentials.', 500);
    }

    logActivity(`Password reset OTP dispatched for ${admin.email}`);
    return { success: true, message: 'One-Time Security Verification Code (OTP) sent successfully to your inbox.' };
  }

  public verifyOTP(email: string, otp: string) {
    const db = loadDB();
    const admin = db.admin;

    if (admin.email.toLowerCase() !== email.toLowerCase()) {
      throw new AppError('Invalid admin email session details', 400);
    }

    if (!admin.resetPasswordOTP || admin.resetPasswordOTP !== String(otp).trim()) {
      throw new AppError('The OTP code entered is invalid. Please double-check or request a new pin layout.', 400);
    }

    const expiry = admin.resetPasswordOTPExpires ? new Date(admin.resetPasswordOTPExpires).getTime() : 0;
    if (Date.now() > expiry) {
      throw new AppError('The validation pin has expired. Code lifetimes last 10 minutes.', 400);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpire = Date.now() + 15 * 60 * 1000;

    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpire = new Date(resetExpire).toISOString();

    admin.resetPasswordOTP = null;
    admin.resetPasswordOTPExpires = null;
    
    db.admin = admin;
    saveDB(db);

    logActivity(`Admin OTP verified successfully for ${email}. Temporarily authorized.`);
    return resetToken;
  }

  public resetPassword(token: string, pass: string) {
    const db = loadDB();
    const admin = db.admin;

    if (!admin.resetPasswordToken || admin.resetPasswordToken !== token) {
      throw new AppError('Secure password reset token is expired or invalid.', 400);
    }

    const expiry = admin.resetPasswordExpire ? new Date(admin.resetPasswordExpire).getTime() : 0;
    if (Date.now() > expiry) {
      throw new AppError('Your 15-minute verification window has expired. Please verify using OTP once again.', 400);
    }

    const salt = bcrypt.genSaltSync(10);
    admin.passwordHash = bcrypt.hashSync(pass, salt);
    admin.resetPasswordToken = null;
    admin.resetPasswordExpire = null;

    db.admin = admin;
    saveDB(db);
    
    logActivity('Admin password reset successfully via dual MFA/OTP verification.');
    return true;
  }
}
export const authService = new AuthService();
