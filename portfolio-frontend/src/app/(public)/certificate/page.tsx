// src/app/(public)/certificates/page.tsx
import type { Metadata } from "next";
import { CertificatesSection } from "@/components/public/CertificationSection";
import { getCertificates } from "@/lib/server-data";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Certificates",
  description: "Verified credentials and certifications earned by Manoj Sunar.",
  alternates: { canonical: "/certificates" },
};

export default async function CertificatesPage() {
  const certificates = await getCertificates();
  return <main><CertificatesSection certificates={certificates} /></main>;
}