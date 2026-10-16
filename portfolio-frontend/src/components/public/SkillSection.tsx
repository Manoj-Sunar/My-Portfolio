"use client";
import { motion } from "framer-motion";
import type { SkillItem } from "@/types";

export function SkillsSection({ skills }: { skills: SkillItem[] }) {
  if (!skills?.length) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary mb-2 block">
            TECH STACK
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated toolkit for building modern, production-grade
            applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-primary font-mono">{skill.level}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}