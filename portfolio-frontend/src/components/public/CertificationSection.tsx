"use client";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import type { CertificateType } from "@/types";

export function CertificatesSection({
  certificates,
}: {
  certificates: CertificateType[];
}) {
  if (!certificates?.length) return null;

  return (
    <section className="section-padding bg-card/30">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary mb-2 block">
            CERTIFICATIONS
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Verified <span className="gradient-text">Credentials</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              {c.image?.url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={c.image.url}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">{c.issuer}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">
                    Issued {c.issueDate?.slice(0, 7)}
                  </span>
                  {c.credentialUrl && (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 text-xs"
                    >
                      Verify <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}