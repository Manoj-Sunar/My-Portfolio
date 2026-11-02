// src/app/(public)/projects/page.tsx
import type { Metadata } from "next";
import { getProjects } from "@/lib/server-data";
import { ProjectsListClient } from "@/components/public/ProjectClient";


export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects — production web platforms, e-commerce, CMSes, and full-stack tools.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: "Projects | Manoj Sunar" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <main className="pt-32 pb-24">
      <ProjectsListClient projects={projects} />
    </main>
  );
}