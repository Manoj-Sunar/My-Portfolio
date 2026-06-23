import { ValidationRule } from "../middleware/validation.js";
import { AchievementItem, ImageAsset, SkillItem } from "../types/index.js";


export interface UpdateAboutDto {
  title?: string;
  content?: string;
  image?: ImageAsset;
  skills?: SkillItem[];
  achievements?: AchievementItem[];
}

export const updateAboutDtoRules: ValidationRule[] = [
  { field: 'title', type: 'string' },
  { field: 'content', type: 'string' },
  { field: 'skills', type: 'array' },
  { field: 'achievements', type: 'array' },
];
