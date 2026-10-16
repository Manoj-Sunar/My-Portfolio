"use client";
import { motion } from "framer-motion";
import { Briefcase, Download, MapPin, Mail, Phone } from "lucide-react";
import type { CVType } from "@/types";

export function CVSection({ cv }: { cv: CVType }) {
  if (!cv) return null;
  const info = cv.personalInfo;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary mb-2 block">
            RESUME
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Curriculum <span className="gradient-text">Vitae</span>
          </h2>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 pb-8 border-b border-border/40">
            <div className="md:col-span-2">
              <h3 className="font-display text-3xl font-bold mb-2">
                {info.name}
              </h3>
              <p className="text-primary font-medium mb-4">{info.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {info.summary}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              {info.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" /> {info.email}
                </div>
              )}
              {info.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> {info.phone}
                </div>
              )}
              {info.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {info.address}
                </div>
              )}
            </div>
          </div>

          <div className="py-8 space-y-8">
            {cv.sections?.map((section) => (
              <div key={section.id}>
                <h4 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {section.title}
                </h4>
                <div className="space-y-5 pl-7">
                  {section.items?.map((item, i) => (
                    <div
                      key={i}
                      className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-primary"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                        <h5 className="font-semibold">{item.title}</h5>
                        {item.date && (
                          <span className="text-xs text-muted-foreground">
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-sm text-primary">{item.subtitle}</p>
                      )}
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">
                          {item.description}
                        </p>
                      )}
                      {item.skills && (
                        <p className="text-xs mt-2">
                          <span className="text-muted-foreground">Skills:</span>{" "}
                          <span className="text-foreground">{item.skills}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border/40">
            {cv.skills?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">Technical Skills</h4>
                <div className="space-y-3">
                  {cv.skills.map((s, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium mb-1">{s.category}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.items.map((item) => (
                          <span
                            key={item}
                            className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cv.languages?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">Languages</h4>
                <ul className="space-y-2 text-sm">
                  {cv.languages.map((l, i) => (
                    <li
                      key={i}
                      className="flex justify-between border-b border-border/30 pb-2"
                    >
                      <span>{l.name}</span>
                      <span className="text-muted-foreground">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 transition glow"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}