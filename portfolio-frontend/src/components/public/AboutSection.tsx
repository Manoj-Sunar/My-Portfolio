"use client";
import { motion } from "framer-motion";
import type { AboutType } from "@/types";
import { CheckCircle2 } from "lucide-react";

export function AboutSection({ about }: { about: AboutType }) {
  return (
    <section className="section-padding bg-card/30">
      <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-xl" />
            {about.image?.url && (
              <img
                src={about.image.url}
                alt="About"
                className="relative rounded-3xl w-full object-cover shadow-2xl"
              />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-medium text-primary mb-2 block">
            ABOUT ME
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            {about.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {about.content}
          </p>

          {about.achievements?.length > 0 && (
            <ul className="space-y-3">
              {about.achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">{a.title}</span>
                    <p className="text-sm text-muted-foreground">
                      {a.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}