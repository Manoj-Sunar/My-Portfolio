// src/app/(public)/page.tsx
import type { Metadata } from "next";
import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { StatsSection } from "@/components/public/StatsSection";
import { ServicesSection } from "@/components/public/ServiceSection";
import { ProjectsSection } from "@/components/public/ProjectSection";
import { EducationSection } from "@/components/public/EducationSection";
import { CertificatesSection } from "@/components/public/CertificationSection";
import { TestimonialsSection } from "@/components/public/TestimonialSection";
import { FAQSection } from "@/components/public/FAQSection";
import { ContactSection } from "@/components/public/ContactSection";
import { getPortfolio } from "@/lib/server-data";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const data = await getPortfolio();
  const faqs = [
    { q: "What technologies do you work with?", a: "React, Next.js, TypeScript, Node.js, NestJS, PostgreSQL, MongoDB, Docker." },
    { q: "Are you available for freelance?", a: "Yes — remote full-time and freelance available." },
  ];

  return (
    <main>
      <HeroSection about={data.about} />
      <AboutSection about={data.about} />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection projects={data.projects} />
      <EducationSection education={data.education} />
      <CertificatesSection certificates={data.certificates} />
      <TestimonialsSection />
      <FAQSection items={faqs} />
      <ContactSection />

      {/* FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </main>
  );
}