"use client";

import { motion } from "framer-motion";
import { Eyebrow, DisplayHeadline } from "@/components/ui/typography";

const stats = [
  { value: "10+", label: "Projects Shipped" },
  { value: "6+", label: "Technologies Mastered" },
  { value: "5+", label: "Countries Served" },
  { value: "100%", label: "Client Satisfaction" },
];

export function StatsSection() {
  return (
    <section className="py-20 md:py-28 border-t border-border/40">
      <div className="container-custom px-6 md:px-10">
        <div className="mb-14 md:mb-16 max-w-2xl">
          <Eyebrow>By The Numbers</Eyebrow>
          <DisplayHeadline as="h2">
            Measurable outcomes, not vanity metrics.
          </DisplayHeadline>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-[-0.04em] leading-none mb-3">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}