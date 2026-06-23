import { ValidationRule } from "../middleware/validation.js";
import { ImageAsset } from "../types/index.js";


export interface CreateProjectDto {
  title: string;
  description: string;
  image?: ImageAsset;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  category?: string;
  featured?: boolean;
}

export const createProjectDtoRules: ValidationRule[] = [
  { field: 'title', required: true, type: 'string', message: 'Project title is required' },
  { field: 'description', required: true, type: 'string', message: 'Project description is required' },
  { field: 'technologies', type: 'array' },
  { field: 'liveUrl', type: 'string' },
  { field: 'githubUrl', type: 'string' },
  { field: 'category', type: 'string' },
];

export interface ReorderProjectsDto {
  ids: string[];
}

export const reorderProjectsDtoRules: ValidationRule[] = [
  { field: 'ids', required: true, type: 'array', message: 'An array of project IDs is required' },
];
