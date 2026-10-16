"use client";

import { EducationSection } from "@/components/public/EducationSection";
import { useEducation } from "@/hook/useEducation";


export default function EducationPage() {
  const { data, isLoading } = useEducation();
  if (isLoading) return <div className="section-padding container-custom">Loading...</div>;
  return <EducationSection education={data ?? []} />;
}