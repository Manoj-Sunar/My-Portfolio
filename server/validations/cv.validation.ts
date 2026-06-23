import { ValidationRule } from "../middleware/validation.js";
import { CVLanguage, CVReference, CVSection, CVSkillCategory } from "../types/index.js";


export interface UpdateCVDto {
  personalInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
    title: string;
    summary: string;
  };
  sections?: CVSection[];
  skills?: CVSkillCategory[];
  languages?: CVLanguage[];
  references?: CVReference[];
  template?: 'modern' | 'classic' | 'creative';
}

export const updateCVDtoRules: ValidationRule[] = [
  { field: 'personalInfo', type: 'object' },
  { field: 'sections', type: 'array' },
  { field: 'skills', type: 'array' },
  { field: 'languages', type: 'array' },
  { field: 'references', type: 'array' },
  { field: 'template', type: 'string' },
];
