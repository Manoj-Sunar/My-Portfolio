import mongoose,{ Schema, model,  Document } from 'mongoose';
import {
  ImageAsset,
  SocialLinks,
  AdminProfile,
  ProjectType,
  EducationType,
  CertificateType,
  SkillItem,
  AchievementItem,
  AboutType,
  CVItem,
  CVSection,
  CVSkillCategory,
  CVLanguage,
  CVReference,
  CVType,
} from '../types/index.js'

export interface IAdminProfileDocument extends AdminProfile {
  passwordHash: string;
  resetPasswordToken?: string | null;
  resetPasswordExpire?: string | null;
  resetPasswordOTP?: string | null;
  resetPasswordOTPExpires?: string | null;
}

export interface IPortfolioDocument extends Document {
  admin: IAdminProfileDocument;
  projects: ProjectType[];
  education: EducationType[];
  certificates: CertificateType[];
  about: AboutType;
  cv: CVType;
  recentActivity: string[];
}

// Image/Asset schema pattern
export const imageAssetSchema = new Schema<ImageAsset>({
  url: { type: String, default: '', trim: true },
  publicId: { type: String, default: '', trim: true }
}, { _id: false });

// Social profiles links schema
export const socialLinksSchema = new Schema<SocialLinks>({
  github: { type: String, default: '', trim: true },
  linkedin: { type: String, default: '', trim: true },
  twitter: { type: String, default: '', trim: true },
  instagram: { type: String, default: '', trim: true }
}, { _id: false });

// Administrative root credentials schema
export const adminProfileSchema = new Schema<IAdminProfileDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpire: { type: String, default: null },
  resetPasswordOTP: { type: String, default: null },
  resetPasswordOTPExpires: { type: String, default: null },
  title: { type: String, default: '', trim: true },
  bio: { type: String, default: '', trim: true },
  profileImage: { type: imageAssetSchema, default: () => ({ url: '', publicId: '' }) },
  socialLinks: { type: socialLinksSchema, default: () => ({ github: '', linkedin: '', twitter: '', instagram: '' }) }
}, { _id: false });

// Project entry schema
export const projectSchema = new Schema<ProjectType>({
  id: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: imageAssetSchema, default: () => ({ url: '', publicId: '' }) },
  technologies: { type: [String], default: [] },
  liveUrl: { type: String, default: '', trim: true },
  githubUrl: { type: String, default: '', trim: true },
  category: { type: String, default: 'General', trim: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { _id: false });

// Certificate entry schema
export const certificateSchema = new Schema<CertificateType>({
  id: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  issueDate: { type: String, required: true, trim: true },
  expiryDate: { type: String, default: '', trim: true },
  credentialId: { type: String, default: '', trim: true },
  credentialUrl: { type: String, default: '', trim: true },
  image: { type: imageAssetSchema, default: () => ({ url: '', publicId: '' }) },
  order: { type: Number, default: 0 }
}, { _id: false });

// Education timeline entry schema
export const educationSchema = new Schema<EducationType>({
  id: { type: String, required: true, index: true },
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, required: true, trim: true },
  startDate: { type: String, required: true, trim: true },
  endDate: { type: String, required: true, trim: true },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '', trim: true },
  grade: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 }
}, { _id: false });

// Skills schema
export const skillItemSchema = new Schema<SkillItem>({
  name: { type: String, required: true, trim: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  icon: { type: String, default: '', trim: true }
}, { _id: false });

// Achievements schema
export const achievementItemSchema = new Schema<AchievementItem>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, default: '', trim: true }
}, { _id: false });

// About summary section schema
export const aboutSchema = new Schema<AboutType>({
  title: { type: String, default: '', trim: true },
  content: { type: String, default: '', trim: true },
  image: { type: imageAssetSchema, default: () => ({ url: '', publicId: '' }) },
  skills: { type: [skillItemSchema], default: [] },
  achievements: { type: [achievementItemSchema], default: [] }
}, { _id: false });

// CV Timeline Item schema
export const cvItemSchema = new Schema<CVItem>({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  skills: { type: String, default: '', trim: true },
  githubUrl: { type: String, default: '', trim: true },
  websiteUrl: { type: String, default: '', trim: true },
  highlights: { type: String, default: '', trim: true }
}, { _id: false });

// CV custom section schema
export const cvSectionSchema = new Schema<CVSection>({
  id: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '', trim: true },
  items: { type: [cvItemSchema], default: [] }
}, { _id: false });

// CV skills list category schema
export const cvSkillCategorySchema = new Schema<CVSkillCategory>({
  id: { type: String, default: '', trim: true },
  category: { type: String, required: true, trim: true },
  items: { type: [String], default: [] }
}, { _id: false });

// CV spoken language entry schema
export const cvLanguageSchema = new Schema<CVLanguage>({
  id: { type: String, default: '', trim: true },
  name: { type: String, required: true, trim: true },
  level: { type: String, required: true, trim: true }
}, { _id: false });

// CV Reference schema
export const cvReferenceSchema = new Schema<CVReference>({
  id: { type: String, default: '', trim: true },
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true }
}, { _id: false });

// Sub-CV data schema
export const cvSchema = new Schema<CVType>({
  personalInfo: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },
    summary: { type: String, default: '', trim: true }
  },
  sections: { type: [cvSectionSchema], default: [] },
  skills: { type: [cvSkillCategorySchema], default: [] },
  languages: { type: [cvLanguageSchema], default: [] },
  references: { type: [cvReferenceSchema], default: [] },
  template: { type: String, default: 'modern', enum: ['modern', 'classic', 'creative'] }
}, { _id: false });

// Main database aggregated Portfolio Schema
export const portfolioSchema = new Schema<IPortfolioDocument>({
  admin: { type: adminProfileSchema, required: true },
  projects: { type: [projectSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  certificates: { type: [certificateSchema], default: [] },
  about: { type: aboutSchema, required: true },
  cv: { type: cvSchema, required: true },
  recentActivity: { type: [String], default: [] }
}, { timestamps: true });

export const PortfolioModel =mongoose.models.Portfolio || model<IPortfolioDocument>('Portfolio', portfolioSchema);
