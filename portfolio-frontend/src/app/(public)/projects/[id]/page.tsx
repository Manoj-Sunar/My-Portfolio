"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hook/useProjects";
import { GithubIcon } from "@/components/ui/brand-icons";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(id ?? "");

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 container-custom space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="text-destructive mb-6">Project not found.</p>
        <button
          onClick={() => router.push("/projects")}
          className="rounded-full bg-primary text-primary-foreground px-6 py-3"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-24">
      <div className="container-custom px-6 md:px-10 max-w-5xl">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all projects
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
            {project.category}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] mb-6">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition glow"
              >
                <ExternalLink className="h-4 w-4" /> View Live
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium hover:bg-muted transition"
              >
                <GithubIcon className="h-4 w-4" /> Source Code
              </a>
            )}
          </div>
        </motion.header>

        {project.image?.url && (
          <div className="relative w-full overflow-hidden rounded-2xl bg-muted/40">
            <img
              src={project.image.url}
              alt={project.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          {project.technologies?.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}