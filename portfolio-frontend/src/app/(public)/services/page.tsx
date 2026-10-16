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
  Check,
} from "lucide-react";

/* ───────────── DATA ───────────── */
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

const detailServices = [
  {
    number: "01",
    label: "UI/UX DESIGN",
    icon: Palette,
    title: "Custom UI/UX Design",
    description:
      "Clear user journeys, polished interfaces, and conversion-focused experiences that support your business goals.",
    tags: ["UI/UX", "Product Design", "Wireframing", "Prototyping"],
    features: [
      "User research & journey mapping",
      "High-fidelity interactive prototypes",
      "Design systems & component libraries",
      "Accessibility-first (WCAG) compliance",
    ],
  },
  {
    number: "02",
    label: "WEB & MOBILE APP",
    icon: Globe,
    title: "Powerful Web & Mobile",
    description:
      "High-performance frontends and intuitive user flows using modern, robust architectural setups.",
    tags: ["Web", "Mobile"],
    features: [
      "React, Next.js, Flutter, React Native",
      "Progressive Web Apps (PWA)",
      "Realtime features & offline-first",
      "Performance budgets & Core Web Vitals",
    ],
  },
  {
    number: "03",
    label: "SEO",
    icon: Search,
    title: "Strategic SEO",
    description:
      "Data-backed analysis to outrank competitors and natively target high-intent keywords.",
    tags: ["Technical SEO", "On-Page", "Off-page SEO", "Local SEO"],
    features: [
      "Technical audits & Core Web Vitals",
      "Keyword research & content strategy",
      "Structured data & rich snippets",
      "Backlink building & authority growth",
    ],
  },
  {
    number: "04",
    label: "BRANDING",
    icon: Sparkles,
    title: "Distinctive Brand Identity",
    description:
      "Brand guideline catalogs, typography kits, and asset ecosystems tailored to your values.",
    tags: ["Branding", "Identity"],
    features: [
      "Logo & visual identity systems",
      "Brand voice & tone guidelines",
      "Typography & color systems",
      "Marketing collateral & templates",
    ],
  },
  {
    number: "05",
    label: "CUSTOM SOFTWARE",
    icon: Code2,
    title: "Enterprise Software",
    description:
      "Clean code practices and robust backend layers structured to minimize technical debt.",
    tags: ["Enterprise Software", "Custom Software"],
    features: [
      "Microservices & event-driven architecture",
      "Multi-tenant SaaS platforms",
      "ERP, CRM, LMS & inventory systems",
      "API design & third-party integrations",
    ],
  },
  {
    number: "06",
    label: "TRAINING & CONSULTING",
    icon: GraduationCap,
    title: "Strategic Enterprise IT",
    description:
      "Architecture workshops, roadmap evaluations, and focused design-sprints optimized for fast delivery.",
    tags: ["IT Training", "Consulting", "Strategy"],
    features: [
      "Architecture reviews & audits",
      "Team upskilling bootcamps",
      "CI/CD & DevOps strategy",
      "Roadmap & technical due diligence",
    ],
  },
];

/* ───────────── INLINE SCROLL-STACK CARD ───────────── */
function StackCard({
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

              <p className="text-muted-foreground leading-relaxed mb-7">
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

/* ───────────── PAGE ───────────── */
export default function ServicesPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative section-padding pt-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
        </div>

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-sm font-medium text-primary mb-4 block uppercase tracking-[0.3em]">
              Our Services
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Building <span className="gradient-text">practical digital</span>{" "}
              products for ambitious businesses.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              From strategy and design to development and deployment — we
              deliver AI-powered solutions and digital experiences tailored to
              your goals.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 font-medium hover:opacity-90 transition glow group"
              >
                Start a Project
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-medium hover:bg-foreground/5 transition"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCROLL-STACKING SERVICES */}
      <section className="relative">
        <div className="section-padding">
          <div className="container-custom text-center max-w-4xl mx-auto">
            <span className="text-sm font-medium text-primary mb-3 block uppercase tracking-[0.25em]">
              Services we offer
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]">
              Access a technology partner that{" "}
              <span className="gradient-text">works as an extension</span> of
              your team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our expert team delivers AI-powered solutions, custom software,
              and digital experiences tailored to your business goals.
            </p>
          </div>
        </div>

        {services.map((service, i) => (
          <StackCard key={service.number} service={service} index={i} />
        ))}

        <div className="h-screen" />
      </section>

      {/* DETAILED GRID */}
      <section className="section-padding bg-card/20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary mb-3 block uppercase tracking-[0.2em]">
              What we do
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
              Every service,{" "}
              <span className="gradient-text">engineered</span> for outcomes.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailServices.map((s, i) => (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group glass rounded-3xl p-7 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">
                    {s.number}
                  </span>
                </div>

                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">
                  {s.label}
                </p>
                <h3 className="font-display text-xl font-semibold mb-2 leading-snug">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {s.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {s.features.slice(0, 3).map((f) => (
                    <li
                      key={f}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {s.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-muted/60 text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all"
                >
                  Know More <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="glass rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Have a project in mind?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Tell us about your goals and we&apos;ll get back to you within
                24 hours with a plan.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 font-medium hover:opacity-90 transition glow group"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}