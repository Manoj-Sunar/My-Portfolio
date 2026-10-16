import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';

export interface ValidationRule {
  field: string;                  // supports dot-notation: 'personalInfo.email'
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  validator?: (value: any) => boolean;
  message?: string;
  minLength?: number;
  maxLength?: number;
}

const getByPath = (obj: any, path: string): any =>
  path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

export const validate = (rules: ValidationRule[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const rule of rules) {
      const val = getByPath(req.body, rule.field);

      if (rule.required && (val === undefined || val === null || val === '')) {
        errors.push(rule.message || `${rule.field} is required`);
        continue;
      }

      if (val === undefined || val === null) continue;

      if (rule.type) {
        if (rule.type === 'array' && !Array.isArray(val)) {
          errors.push(`${rule.field} must be an array`);
          continue;
        }
        if (rule.type !== 'array' && typeof val !== rule.type) {
          errors.push(`${rule.field} must be a ${rule.type}`);
          continue;
        }
      }

      if (rule.type === 'string') {
        if (rule.minLength && val.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && val.length > rule.maxLength) {
          errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
        }
      }

      if (rule.validator && !rule.validator(val)) {
        errors.push(rule.message || `Invalid format for ${rule.field}`);
      }
    }

    if (errors.length) {
      next(new AppError(errors.join('; '), 400));
      return;
    }

    next();
  };
};