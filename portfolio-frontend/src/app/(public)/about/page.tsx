// src/app/(public)/about/page.tsx
import type { Metadata } from "next";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillSection";
import { getAbout } from "@/lib/server-data";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "About",
  description: "Full Stack Software Engineer in Pokhara, Nepal. Background, skills, and approach to building production software.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const about = await getAbout();
  return (
    <main>
      <AboutSection about={about} />
      <SkillsSection skills={about.skills} />
    </main>
  );
}