// src/app/(public)/projects/page.tsx
"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectType } from "@/types";
import { useProjects } from "@/hook/useProjects";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    projects?.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    const list = projects ?? [];
    if (activeCategory === "All") return list;
    return list.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <main className="pt-32 pb-24">
      <section className="container-custom px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase mb-5 block">
            Our Projects
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6">
            We help bring <span className="text-primary">ideas to life</span>{" "}
            and create digital products that work
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2.5 mb-20"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-md text-sm font-medium transition-all border ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent border-border text-foreground hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>
      </section>

      <section className="container-custom px-6 md:px-10">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-20">
            Loading projects...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            No projects found in this category.
          </div>
        ) : (
          <div className="space-y-24 md:space-y-32">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </main>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: ProjectType;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group"
    >
      {project.image?.url && (
        <Link href={`/projects/${project.id}`} className="block">
          <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted/40">
            <img
              src={project.image.url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      )}

      <div className="mt-7 flex items-start justify-between gap-6">
        <Link href={`/projects/${project.id}`} className="flex-1">
          <h2 className="font-display text-2xl md:text-3xl lg:text-[2rem] font-semibold leading-tight mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h2>
        </Link>
        <Link
          href={`/projects/${project.id}`}
          aria-label={`View ${project.title}`}
          className="shrink-0 w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>

      <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.technologies?.length ? (
          project.technologies.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
            >
              {t}
            </span>
          ))
        ) : (
          <span className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground">
            {project.category}
          </span>
        )}
      </div>
    </motion.article>
  );
}