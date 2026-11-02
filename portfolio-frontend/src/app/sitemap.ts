// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/server-data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://manojkami.com.np";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects().catch(() => []);
  const staticRoutes = ["", "/about", "/projects", "/education", "/certificates", "/cv", "/contact", "/services"]
    .map((p) => ({
      url: `${SITE}${p}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    }));

  const projectRoutes = projects.map((p) => ({
    url: `${SITE}/projects/${p.slug ?? p.id}`,
    lastModified: new Date(p.updatedAt ?? Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}