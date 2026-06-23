import { ValidationRule } from "../middleware/validation.js";


export interface LoginDto {
  email: string;
  password?: string;
}

export const loginDtoRules: ValidationRule[] = [
  { field: 'email', required: true, type: 'string', message: 'Valid email address is required' },
  { field: 'password', required: true, type: 'string', message: 'Password is required' },
];

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  bio?: string;
  title?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export const updateProfileDtoRules: ValidationRule[] = [
  { field: 'name', type: 'string' },
  { field: 'email', type: 'string' },
  { field: 'bio', type: 'string' },
  { field: 'title', type: 'string' },
];

export interface ChangePasswordDto {
  currentPassword?: string;
  newPassword?: string;
}

export const changePasswordDtoRules: ValidationRule[] = [
  { field: 'currentPassword', required: true, type: 'string' },
  { field: 'newPassword', required: true, type: 'string', validator: (val) => val.length >= 6 && /\d/.test(val) && /[a-zA-Z]/.test(val), message: 'New password must be at least 6 characters and contain both letters and numbers' },
];

export interface ForgotPasswordDto {
  email: string;
}

export const forgotPasswordDtoRules: ValidationRule[] = [
  { field: 'email', required: true, type: 'string', message: 'Valid email address is required' },
];

export interface VerifyOTPDto {
  email: string;
  otp: string;
}

export const verifyOTPDtoRules: ValidationRule[] = [
  { field: 'email', required: true, type: 'string' },
  { field: 'otp', required: true, type: 'string', validator: (val) => /^\d{6}$/.test(val), message: 'OTP must be a 6-digit numeric string' },
];

export interface ResetPasswordDto {
  token?: string;
  password?: string;
}

export const resetPasswordDtoRules: ValidationRule[] = [
  { field: 'token', required: true, type: 'string' },
  { field: 'password', required: true, type: 'string', validator: (val) => val.length >= 6 && /\d/.test(val) && /[a-zA-Z]/.test(val), message: 'Password must be at least 6 characters and contain both letters and numbers' },
];
