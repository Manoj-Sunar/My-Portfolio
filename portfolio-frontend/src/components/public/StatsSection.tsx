"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "10+", label: "Projects Shipped" },
  { value: "6+", label: "Technologies" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "2+", label: "Years Building" },
];

export function StatsSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center glass rounded-2xl p-6"
            >
              <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}