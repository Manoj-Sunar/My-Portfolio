"use client";

import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { StatsSection } from "@/components/public/StatsSection";

import { EducationSection } from "@/components/public/EducationSection";


import { FAQSection } from "@/components/public/FAQSection";
import { ContactSection } from "@/components/public/ContactSection";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/hook/usePortfolio";
import { ServicesSection } from "@/components/public/ServiceSection";
import { TestimonialsSection } from "@/components/public/TestimonialSection";
import { CertificatesSection } from "@/components/public/CertificationSection";
import { ProjectsSection } from "@/components/public/ProjectSection";


export default function HomePage() {
  const { data, isLoading, error } = usePortfolio();

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 container-custom px-6 space-y-8 max-w-4xl">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load portfolio.</p>
      </div>
    );
  }

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
      <FAQSection />
      <ContactSection />
    </main>
  );
}