"use client";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import type { AboutType } from "@/types";

export function HeroSection({ about }: { about: AboutType }) {
  return (
    <section className="relative min-h-screen flex items-center section-padding overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-0 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              Available for opportunities
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            Building <span className="gradient-text">digital</span> products that
            scale.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
            {about.content?.slice(0, 200)}...
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground hover:opacity-90 transition glow group"
            >
              View Projects
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href="/cv"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3 font-medium hover:bg-foreground/5 transition"
            >
              <Download className="h-4 w-4" />
              Download CV
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden glass p-3">
              {about.image?.url && (
                <img
                  src={about.image.url}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}