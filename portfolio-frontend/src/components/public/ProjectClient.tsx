// src/app/(public)/projects/ProjectsListClient.tsx
"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProjectType } from "@/types";

export function ProjectsListClient({ projects }: { projects: ProjectType[] }) {
  const [active, setActive] = useState("All");
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    projects.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [projects]);
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <section className="container-custom px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase mb-5 block">
            Our Projects
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6">
            We help bring <span className="text-primary">ideas to life</span> and create digital products that work
          </h1>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-2.5 mb-20">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-5 py-2.5 rounded-md text-sm font-medium border ${
                active === cat ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted/50"}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>
      <section className="container-custom px-6 md:px-10">
        <div className="space-y-24 md:space-y-32">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project, index }: { project: ProjectType; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group"
    >
      {project.image?.url && (
        <Link href={`/projects/${project.slug ?? project.id}`} className="block">
          <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted/40">
            <Image src={project.image.url} alt={project.title} fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          </div>
        </Link>
      )}
      <div className="mt-7 flex items-start justify-between gap-6">
        <Link href={`/projects/${project.slug ?? project.id}`} className="flex-1">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h2>
        </Link>
        <Link href={`/projects/${project.slug ?? project.id}`} aria-label={`View ${project.title}`}
          className="shrink-0 w-11 h-11 rounded-full border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>
      <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {(project.technologies ?? []).map((t) => (
          <span key={t} className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground">{t}</span>
        ))}
      </div>
    </motion.article>
  );
}