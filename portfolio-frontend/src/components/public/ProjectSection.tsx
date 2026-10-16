"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { ProjectType } from "@/types";

import { Eyebrow, DisplayHeadline, BodyText } from "@/components/ui/typography";

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
    <section className="py-20 md:py-28 border-t border-border/40">
      <div className="container-custom px-6 md:px-10">
        {/* New editorial header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <Eyebrow>Our Work</Eyebrow>
          <DisplayHeadline className="mb-6">
            Selected projects, built to last.
          </DisplayHeadline>
          <BodyText>
            Real products solving real problems — from e-commerce platforms to
            content-driven CMSes and AI-assisted tools.
          </BodyText>
        </div>

        {/* Category filter — plain bordered buttons */}
        {showFilter && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] border transition-colors ${
                  activeCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
                style={{ borderRadius: 0 }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid unchanged */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group"
              >
                <Link href={`/projects/${p.id}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted/40">
                    {p.image?.url ? (
                      <img
                        src={p.image.url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                </Link>

                <div className="mt-6 flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground tracking-[-0.02em] leading-tight mb-2 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.technologies?.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[11px] uppercase tracking-wider text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 border border-border px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground hover:border-foreground transition-colors"
            style={{ borderRadius: 0 }}
          >
            View All Work
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}