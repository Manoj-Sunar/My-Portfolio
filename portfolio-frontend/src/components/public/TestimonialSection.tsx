"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const items = [
  {
    name: "Lumino Technology",
    role: "Mentor / Internship",
    quote:
      "Manoj delivered production-ready features ahead of schedule with excellent code quality.",
  },
  {
    name: "Elaric",
    role: "Remote Contract",
    quote:
      "Reliable, self-driven and comfortable working across the full MERN stack.",
  },
  {
    name: "Client Project",
    role: "Church CMS",
    quote:
      "Turned a complex content requirement into an easy-to-use admin experience.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary mb-2 block">
            TESTIMONIALS
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            What people <span className="gradient-text">say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative"
            >
              <Quote className="h-8 w-8 text-primary/30 absolute top-5 right-5" />
              <p className="text-sm leading-relaxed mb-6 italic text-muted-foreground">
                &quot;{t.quote}&quot;
              </p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}