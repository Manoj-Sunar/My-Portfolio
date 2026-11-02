"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type FAQItem = { q: string; a: string };

const defaultFaqs: FAQItem[] = [
  { q: "What technologies do you work with?", a: "React, Next.js, TypeScript, Node.js, NestJS, PostgreSQL, MongoDB, Docker." },
  { q: "Are you available for freelance?", a: "Yes — open to remote full-time and freelance." },
  { q: "How do you handle deployment?", a: "Vercel, Render, AWS, and Docker with CI/CD pipelines." },
  { q: "Frontend and backend?", a: "Full-stack delivery including API design, auth, caching, and deployment." },
];

export function FAQSection({ items = defaultFaqs }: { items?: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
   
 <section className="section-padding bg-card/30">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary mb-2 block">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {defaultFaqs.map((f, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



