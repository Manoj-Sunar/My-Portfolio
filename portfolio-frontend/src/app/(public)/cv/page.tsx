// src/app/(public)/cv/page.tsx
import type { Metadata } from "next";
import { CVSection } from "@/components/public/CVSection";
import { getCV } from "@/lib/server-data";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Resume",
  description: "Download or view the CV of Manoj Sunar — Full Stack Software Engineer.",
  alternates: { canonical: "/cv" },
};

export default async function CVPage() {
  const cv = await getCV();
  return <main><CVSection cv={cv} /></main>;
}