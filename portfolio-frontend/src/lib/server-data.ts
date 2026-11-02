// src/lib/server-data.ts
import "server-only";
import { serverApi } from "./apiClient";
import type {
  AboutType, ProjectType, EducationType, CertificateType,
  CVType, PortfolioData, SkillItem,
} from "@/types";

export const TAGS = {
  about: "about",
  projects: "projects",
  education: "education",
  certificates: "certificates",
  cv: "cv",
  portfolio: "portfolio",
} as const;

const revalidate = 300; // 5 min ISR

export const getAbout = () =>
  serverApi<AboutType>("/about", { tags: [TAGS.about, TAGS.portfolio], revalidate });

export const getProjects = () =>
  serverApi<ProjectType[]>("/projects", { tags: [TAGS.projects, TAGS.portfolio], revalidate });

export const getProject = (id: string) =>
  serverApi<ProjectType>(`/projects/${id}`, { tags: [TAGS.projects, `project:${id}`], revalidate });

export const getEducation = () =>
  serverApi<EducationType[]>("/education", { tags: [TAGS.education, TAGS.portfolio], revalidate });

export const getCertificates = () =>
  serverApi<CertificateType[]>("/certificates", { tags: [TAGS.certificates, TAGS.portfolio], revalidate });

export const getCV = () =>
  serverApi<CVType>("/cv", { tags: [TAGS.cv, TAGS.portfolio], revalidate });

export const getPortfolio = () =>
  serverApi<PortfolioData>("/portfolio", { tags: [TAGS.portfolio], revalidate });