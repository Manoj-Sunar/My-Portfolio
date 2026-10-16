"use client";


import { CVSection } from "@/components/public/CVSection";
import { useCV } from "@/hook/useCV";


export default function CVPage() {
  const { data, isLoading } = useCV();
  if (isLoading) return <div className="section-padding container-custom">Loading...</div>;
  if (!data) return null;
  return <CVSection cv={data} />;
}