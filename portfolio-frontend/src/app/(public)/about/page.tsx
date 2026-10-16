"use client";


import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useAbout } from "@/hook/useAbout";



export default function AboutPage() {
  const { data, isLoading } = useAbout();
  if (isLoading) return <div className="section-padding container-custom"><Skeleton className="h-96 w-full" /></div>;
  if (!data) return null;
  return (
    <>
      <AboutSection about={data} />
      <SkillsSection skills={data.skills} />
    </>
  );
}