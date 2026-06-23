import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';


export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  validator?: (value: any) => boolean;
  message?: string;
}

export const validate = (rules: ValidationRule[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const rule of rules) {
      const val = req.body[rule.field];

      // Required checking
      if (rule.required && (val === undefined || val === null || val === '')) {
        errors.push(rule.message || `${rule.field} is a required field`);
        continue;
      }

      // Type checking
      if (val !== undefined && val !== null) {
        if (rule.type) {
          if (rule.type === 'array' && !Array.isArray(val)) {
            errors.push(`${rule.field} must be of type array`);
          } else if (rule.type !== 'array' && typeof val !== rule.type) {
            errors.push(`${rule.field} must be of type ${rule.type}`);
          }
        }

        // Custom validation check
        if (rule.validator && !rule.validator(val)) {
          errors.push(rule.message || `Invalid format for field ${rule.field}`);
        }
      }
    }

    if (errors.length > 0) {
      next(new AppError(errors.join('; '), 400));
      return;
    }

    next();
  };
};
