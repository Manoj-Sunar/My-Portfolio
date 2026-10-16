"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Palette,
  Globe,
  Search,
  Sparkles,
  Code2,
  GraduationCap,
} from "lucide-react";

const services = [
  {
    number: "01",
    label: "UI/UX DESIGN",
    title: "Custom UI/UX Design for",
    highlight: "websites, mobile apps, dashboards",
    suffix: "and digital products.",
    description:
      "Lumino designs clear user journeys, polished interfaces, and conversion-focused experiences that support your business goals.",
    tags: ["UI/UX", "Product Design", "Wireframing", "Prototyping"],
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1618788372246-79faff0c3742?auto=format&fit=crop&w=1400&q=80",
    accent: "from-blue-500/40 to-cyan-500/30",
  },
  {
    number: "02",
    label: "WEB & MOBILE APP",
    title: "Powerful Web & Mobile",
    highlight: "solutions built to enhance",
    suffix: "user engagement.",
    description:
      "We craft high-performance frontends and intuitive user flows using modern, robust architectural setups to scale with your traffic.",
    tags: ["Web", "Mobile"],
    icon: Globe,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
    accent: "from-indigo-500/40 to-purple-500/30",
  },
  {
    number: "03",
    label: "SEO",
    title: "Strategic Search Engine",
    highlight: "optimization to boost visibility",
    suffix: "and drive organic acquisition.",
    description:
      "Data-backed analysis to outrank competitors, optimize search engine crawlability, and natively target high-intent keywords.",
    tags: ["Technical SEO", "On-Page", "Off-page SEO", "Local SEO"],
    icon: Search,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    accent: "from-emerald-500/40 to-teal-500/30",
  },
  {
    number: "04",
    label: "BRANDING",
    title: "Distinctive Brand Identity",
    highlight: "frameworks designed to uniquely",
    suffix: "position your organization.",
    description:
      "Comprehensive brand guideline catalogs, customized typography kits, and dynamic asset ecosystems tailored to your values.",
    tags: ["Branding", "Identity"],
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1400&q=80",
    accent: "from-orange-500/40 to-pink-500/30",
  },
  {
    number: "05",
    label: "CUSTOM SOFTWARE",
    title: "Enterprise software solutions",
    highlight: "designed to streamline operations",
    suffix: "and accelerate transformation.",
    description:
      "Clean code practices and robust backend database layers structured carefully to minimize technical debt.",
    tags: ["Enterprise Software", "Custom Software", "Product Development"],
    icon: Code2,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    accent: "from-rose-500/40 to-red-500/30",
  },
  {
    number: "06",
    label: "TRAINING & CONSULTING",
    title: "Strategic Enterprise IT",
    highlight: "Consulting to rapidly upgrade",
    suffix: "internal systems.",
    description:
      "Interactive architecture workshops, roadmap evaluations, and focused design-sprints optimized for fast delivery.",
    tags: ["IT Training", "Consulting", "Strategy"],
    icon: GraduationCap,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    accent: "from-violet-500/40 to-fuchsia-500/30",
  },
];

function ServiceStackCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0.5, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div
      ref={ref}
      className="sticky top-0 h-screen flex items-center justify-center px-4 md:px-8"
      style={{ zIndex: index + 1 }}
    >
      <motion.div style={{ scale, opacity, y }} className="w-full max-w-6xl">
        <div className="glass rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/40">
          <div className="grid lg:grid-cols-2 min-h-[520px]">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {service.label}
                  </div>
                  <div className="font-mono text-lg text-primary font-semibold">
                    {service.number}
                  </div>
                </div>
              </div>

              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-5">
                {service.title}{" "}
                <span className="gradient-text">{service.highlight}</span>{" "}
                {service.suffix}
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-7 text-base">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition group w-fit glow"
              >
                Know More
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative min-h-[300px] lg:min-h-full overflow-hidden order-1 lg:order-2">
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${service.accent}`}
              />
              <img
                src={service.image}
                alt={service.label}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-card via-card/40 to-transparent" />
              <div className="absolute bottom-6 right-8 font-display text-[10rem] leading-none font-bold text-foreground/5 select-none pointer-events-none">
                {service.number}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ServiceStack() {
  return (
    <section className="relative">
      <div className="section-padding">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <span className="text-sm font-medium text-primary mb-3 block uppercase tracking-[0.25em]">
            Services we offer
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]">
            Access a technology partner that{" "}
            <span className="gradient-text">works as an extension</span> of your
            team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our expert team delivers AI-powered solutions, custom software, and
            digital experiences tailored to your business goals — from strategy
            and design to development and deployment.
          </p>
        </div>
      </div>

      {services.map((service, i) => (
        <ServiceStackCard key={service.number} service={service} index={i} />
      ))}

      <div className="h-screen" />
    </section>
  );
}

/* Aliases so either import name works */
export const ServicesStack = ServiceStack;
export const ServicesSection = ServiceStack;