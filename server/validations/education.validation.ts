import { ValidationRule } from "../middleware/validation.js";


export interface CreateEducationDto {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  grade?: string;
}

export const createEducationDtoRules: ValidationRule[] = [
  { field: 'institution', required: true, type: 'string', message: 'Institution name is required' },
  { field: 'degree', required: true, type: 'string', message: 'Degree qualification is required' },
  { field: 'field', required: true, type: 'string', message: 'Field of study is required' },
  { field: 'startDate', required: true, type: 'string', message: 'Start date is required' },
  { field: 'endDate', type: 'string' },
  { field: 'isCurrent', type: 'boolean' },
  { field: 'description', type: 'string' },
  { field: 'grade', type: 'string' },
];
