export interface ImageAsset { url: string; publicId: string; }

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies?: string[];
  image?: { url: string } | null;
  liveUrl?: string | null;
  githubUrl?: string | null;

  // ADD THESE:
  slug?: string;
  updatedAt?: string;
  featured?: boolean;
};

export interface EducationType {
  id: string; institution: string; degree: string; field: string;
  startDate: string; endDate: string; isCurrent: boolean;
  description?: string; grade?: string; order: number;
}

export interface CertificateType {
  id: string; title: string; issuer: string; issueDate: string;
  expiryDate?: string; credentialId?: string; credentialUrl?: string;
  image: ImageAsset; order: number;
}

export interface SkillItem { name: string; level: number; icon?: string; }
export interface AchievementItem { title: string; description: string; icon?: string; }

export interface AboutType {
  title: string; content: string; image: ImageAsset;
  skills: SkillItem[]; achievements: AchievementItem[];
}

export interface CVItem {
  title: string; subtitle: string; date: string; description: string;
  skills?: string; githubUrl?: string; websiteUrl?: string; highlights?: string;
}
export interface CVSection { id: string; title: string; content?: string; items: CVItem[]; }
export interface CVType {
  personalInfo: { name: string; email: string; phone: string; address: string;
    website?: string; title: string; summary: string; };
  sections: CVSection[];
  skills: { category: string; items: string[] }[];
  languages: { name: string; level: string }[];
  references: { name: string; position: string; company: string; contact: string }[];
  template: "modern" | "classic" | "creative";
}

export interface AdminProfile {
  name: string; email: string; profileImage: ImageAsset; bio: string; title: string;
  socialLinks: { github?: string; linkedin?: string; twitter?: string; instagram?: string; };
}

export interface PortfolioData {
  about: AboutType; projects: ProjectType[];
  education: EducationType[]; certificates: CertificateType[]; cv: CVType;
}

export interface DashboardStats {
  totalProjects: number; totalEducation: number; totalSkills: number;
  totalCertificates: number; recentActivity: string[];
}

export interface UploadResponse { url: string; publicId: string; }