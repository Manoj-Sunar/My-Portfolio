"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eyebrow, DisplayHeadline, BodyText } from "@/components/ui/typography";
import type { AboutType } from "@/types";

export function HeroSection({ about }: { about: AboutType }) {
  const intro = (about.content ?? "").split("\n")[0] || "";

  return (
    <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
      <div className="container-custom px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* LEFT — text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <Eyebrow>Full-Stack Developer · Pokhara, Nepal</Eyebrow>

            <DisplayHeadline className="mb-8">
              Building products that respect your time, your data, and your users.
            </DisplayHeadline>

            <BodyText className="mb-10">
              {intro ||
                "I design and engineer production-grade web platforms — from clean data models to polished interfaces that scale."}
            </BodyText>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-3 bg-foreground text-background px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors"
                style={{ borderRadius: 0 }}
              >
                View Work
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-border px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:border-foreground transition-colors"
                style={{ borderRadius: 0 }}
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>

          {/* RIGHT — image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              {about.image?.url ? (
                <img
                  src={about.image.url}
                  alt={about.title}
                  className="w-full object-cover aspect-[4/5]"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-muted" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}