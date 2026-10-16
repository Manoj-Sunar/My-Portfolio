"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { ProjectType } from "@/types";
import { GithubIcon } from "../ui/brand-icons";


export function ProjectsSection({
  projects,
  showFilter = true,
}: {
  projects: ProjectType[];
  showFilter?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    projects?.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return projects ?? [];
    return (projects ?? []).filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section className="section-padding bg-card/20" id="work">
      <div className="container-custom">
        <div className="max-w-4xl mb-12">
          <span className="text-sm font-medium text-primary mb-3 block uppercase tracking-[0.2em]">
            Our works
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4">
            We are digital architects delivering{" "}
            <span className="gradient-text">practical, scalable</span> digital
            solutions.
          </h2>
          <p className="text-muted-foreground">
            From startups to corporate houses, we thrive on turning complex
            challenges into elegant digital realities.
          </p>
        </div>

        {showFilter && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "text-primary-foreground"
                    : "text-muted-foreground glass hover:text-foreground"
                }`}
              >
                {activeCategory === cat && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative glass rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.image?.url ? (
                    <img
                      src={p.image.url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="font-display text-6xl font-bold text-primary/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                  <div className="absolute top-5 left-5">
                    <span className="font-mono text-xs text-white/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="absolute top-5 right-5">
                    <span className="text-xs px-3 py-1 rounded-full glass text-white/90">
                      {p.category}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                      {p.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      {p.technologies?.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/10 backdrop-blur text-white/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Live
                        </a>
                      )}
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                        >
                          <GithubIcon className="h-3.5 w-3.5" /> Code
                        </a>
                      )}
                    </div>

                    <div className="w-9 h-9 rounded-full glass flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center mt-14">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full glass px-8 py-4 font-medium hover:bg-foreground/5 hover:border-primary/40 transition group"
          >
            View All Work
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}









































 