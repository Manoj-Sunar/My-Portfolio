"use client";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { EducationType } from "@/types";

export function EducationSection({
  education,
}: {
  education: EducationType[];
}) {
  if (!education?.length) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary mb-2 block">
            EDUCATION
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Academic <span className="gradient-text">Journey</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 flex gap-5"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h3 className="font-display text-xl font-semibold">
                    {edu.degree}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {edu.startDate?.slice(0, 7)} —{" "}
                    {edu.isCurrent ? "Present" : edu.endDate?.slice(0, 7)}
                  </span>
                </div>
                <p className="text-primary font-medium text-sm mb-1">
                  {edu.institution}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {edu.field}
                </p>
                {edu.description && (
                  <p className="text-sm text-muted-foreground">
                    {edu.description}
                  </p>
                )}
                {edu.grade && (
                  <p className="text-sm mt-2">
                    <span className="text-muted-foreground">Grade:</span>{" "}
                    <span className="font-medium">{edu.grade}</span>
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}