"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Palette,
  Globe,
  Search,
  Sparkles,
  Code2,
  GraduationCap,
} from "lucide-react";
import { Eyebrow, DisplayHeadline, BodyText } from "@/components/ui/typography";

const services = [
  {
    number: "01",
    label: "UI/UX Design",
    headline: "Interfaces that feel obvious the first time.",
    description:
      "Clear user journeys, polished interfaces, and conversion-focused experiences that support your business goals.",
    tags: ["UI/UX", "Product Design", "Wireframing", "Prototyping"],
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1618788372246-79faff0c3742?auto=format&fit=crop&w=1400&q=80",
  },
  {
    number: "02",
    label: "Web & Mobile",
    headline: "Built to scale with your traffic, not break under it.",
    description:
      "High-performance frontends and intuitive user flows using modern, robust architectural setups.",
    tags: ["Web", "Mobile"],
    icon: Globe,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
  },
  {
    number: "03",
    label: "SEO",
    headline: "Search visibility that compounds month over month.",
    description:
      "Data-backed analysis to outrank competitors and target high-intent keywords.",
    tags: ["Technical SEO", "On-Page", "Local SEO"],
    icon: Search,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    number: "04",
    label: "Branding",
    headline: "A visual system that stays consistent everywhere.",
    description:
      "Brand guideline catalogs, typography kits, and dynamic asset ecosystems.",
    tags: ["Branding", "Identity"],
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    number: "05",
    label: "Custom Software",
    headline: "Software shaped around your workflows.",
    description:
      "Clean code and robust backend layers structured to minimize technical debt.",
    tags: ["Enterprise", "Custom Software"],
    icon: Code2,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  },
  {
    number: "06",
    label: "Consulting",
    headline: "Strategic guidance for teams that ship.",
    description:
      "Architecture workshops, roadmap evaluations, and focused design-sprints.",
    tags: ["Training", "Consulting", "Strategy"],
    icon: GraduationCap,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
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

  const scale = useTransform(scrollYProgress, [0.5, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0.35]);

  return (
    <div
      ref={ref}
      className="sticky top-0 h-screen flex items-center justify-center px-4 md:px-8"
      style={{ zIndex: index + 1 }}
    >
      <motion.div style={{ scale, opacity }} className="w-full max-w-6xl">
        <div className="bg-background border border-border overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[500px]">
            <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
              <Eyebrow>{service.label}</Eyebrow>

              <DisplayHeadline as="h2" className="mb-6">
                {service.headline}
              </DisplayHeadline>

              <BodyText className="mb-6">{service.description}</BodyText>

              <div className="flex flex-wrap gap-2 mb-8">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 border border-border text-muted-foreground"
                    style={{ borderRadius: 0 }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors"
              >
                Know More <span>→</span>
              </Link>
            </div>

            <div className="relative min-h-[300px] lg:min-h-full overflow-hidden">
              <img
                src={service.image}
                alt={service.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ServiceStack() {
  return (
    <section className="relative border-t border-border/40">
      <div className="py-20 md:py-28">
        <div className="container-custom px-6 md:px-10 max-w-4xl">
          <Eyebrow>Services We Offer</Eyebrow>
          <DisplayHeadline>
            Access a technology partner that treats your problem as its own.
          </DisplayHeadline>
        </div>
      </div>

      {services.map((service, i) => (
        <ServiceStackCard key={service.number} service={service} index={i} />
      ))}

      <div className="h-screen" />
    </section>
  );
}

export const ServicesSection = ServiceStack;
export const ServicesStack = ServiceStack;
export { ServiceStack as ServiceSection };