export interface ImageAsset {
  url: string;
  publicId: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  profileImage: ImageAsset;
  bio: string;
  title: string;
  socialLinks: SocialLinks;
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  image: ImageAsset;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
  order: number;
}

export interface EducationType {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
  grade?: string;
  order: number;
}

export interface CertificateType {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image: ImageAsset;
  order: number;
}

export interface SkillItem {
  id?: string;
  name: string;
  level: number; // 0-100
  icon?: string;
}

export interface AchievementItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface AboutType {
  title: string;
  content: string;
  image: ImageAsset;
  skills: SkillItem[];
  achievements: AchievementItem[];
}

export interface CVItem {
  id?: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  skills?: string;
  githubUrl?: string;
  websiteUrl?: string;
  highlights?: string;
}

export interface CVSection {
  id: string;
  title: string;
  content?: string;
  items: CVItem[];
}

export interface CVSkillCategory {
  id?: string;
  category: string;
  items: string[];
}

export interface CVLanguage {
  id?: string;
  name: string;
  level: string; // Native, Fluent, Intermediate, Basic, etc.
}

export interface CVReference {
  id?: string;
  name: string;
  position: string;
  company: string;
  contact: string;
}

export interface CVType {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
    title: string;
    summary: string;
  };
  sections: CVSection[];
  skills: CVSkillCategory[];
  languages: CVLanguage[];
  references: CVReference[];
  template: 'modern' | 'classic' | 'creative';
}

export interface DashboardStats {
  totalProjects: number;
  totalEducation: number;
  totalSkills: number;
  totalCertificates?: number;
  recentActivity: string[];
}
