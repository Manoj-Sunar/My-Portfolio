"use client";



import { AboutSection } from "@/components/public/AboutSection";
import { CertificatesSection } from "@/components/public/CertificationSection";
import { ContactSection } from "@/components/public/ContactSection";
import { EducationSection } from "@/components/public/EducationSection";
import { FAQSection } from "@/components/public/FAQSection";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectsSection } from "@/components/public/ProjectSection";
import { ServicesSection } from "@/components/public/ServiceSection";

import { SkillsSection } from "@/components/public/SkillSection";
import { StatsSection } from "@/components/public/StatsSection";
import { TestimonialsSection } from "@/components/public/TestimonialSection";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/hook/usePortfolio";


export default function HomePage() {
  const { data, isLoading, error } = usePortfolio();

  if (isLoading) {
    return (
      <div className="section-padding container-custom space-y-8">
        <Skeleton className="h-24 w-2/3" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-destructive">
        Failed to load portfolio. Please try again later.
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
      <SkillsSection skills={data.about.skills} />
      <EducationSection education={data.education} />
      <CertificatesSection certificates={data.certificates} />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection about={data.about} />
    </main>
  );
}