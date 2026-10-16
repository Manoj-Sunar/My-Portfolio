"use client";

import { motion } from "framer-motion";
import { Eyebrow, DisplayHeadline, BodyText } from "@/components/ui/typography";
import type { AboutType } from "@/types";

export function AboutSection({ about }: { about: AboutType }) {
  const paragraphs = (about.content ?? "").split("\n").filter(Boolean);

  return (
    <section className="py-20 md:py-28 border-t border-border/40">
      <div className="container-custom px-6 md:px-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow>Who We Are</Eyebrow>

          <DisplayHeadline className="mb-8">
            {about.title}
          </DisplayHeadline>

          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <BodyText key={i}>{p}</BodyText>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}