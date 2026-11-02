// src/app/(public)/projects/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import { getProject, getProjects } from "@/lib/server-data";
import { GithubIcon } from "@/components/ui/brand-icons";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ id: p.slug ?? p.id }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await getProject(id);
    return {
      title: p.title,
      description: p.description?.slice(0, 160),
      alternates: { canonical: `/projects/${id}` },
      openGraph: {
        title: `${p.title} | Manoj Sunar`,
        description: p.description?.slice(0, 160),
        url: `/projects/${id}`,
        images: p.image?.url ? [{ url: p.image.url, alt: p.title }] : undefined,
      },
      twitter: { card: "summary_large_image", title: p.title, images: p.image?.url ? [p.image.url] : undefined },
    };
  } catch {
    return { title: "Project Not Found" };
  }
}

export default async function ProjectDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id).catch(() => null);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.image?.url,
    url: `https://manojkami.com.np/projects/${id}`,
    creator: { "@type": "Person", name: "Manoj Sunar" },
    keywords: project.technologies?.join(", "),
  };

  return (
    <article className="pt-32 pb-24">
      <div className="container-custom px-6 md:px-10 max-w-5xl">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to all projects
        </Link>

        <header className="mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
            {project.category}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] mb-6">{project.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition">
                <ExternalLink className="h-4 w-4" /> View Live
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-medium hover:bg-muted transition">
                <GithubIcon className="h-4 w-4" /> Source Code
              </a>
            )}
          </div>
        </header>

        {project.image?.url && (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-muted/40">
            <Image src={project.image.url} alt={project.title} fill priority sizes="(max-width:1200px) 100vw, 1200px" className="object-cover" />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          {project.technologies?.map((t) => (
            <span key={t} className="text-xs px-3 py-1.5 rounded-md border text-muted-foreground">{t}</span>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}