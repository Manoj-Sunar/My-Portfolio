// src/app/(public)/education/page.tsx
import type { Metadata } from "next";
import { EducationSection } from "@/components/public/EducationSection";
import { getEducation } from "@/lib/server-data";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Education",
  description: "Academic background and qualifications of Manoj Sunar.",
  alternates: { canonical: "/education" },
};

export default async function EducationPage() {
  const education = await getEducation();
  return <main className="section-padding"><EducationSection education={education} /></main>;
}