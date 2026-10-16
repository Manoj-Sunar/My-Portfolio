"use client";

import { CertificatesSection } from "@/components/public/CertificateSection";
import { useCertificates } from "@/hook/useCertificates";


export default function CertificatesPage() {
  const { data, isLoading } = useCertificates();
  if (isLoading) return <div className="section-padding container-custom">Loading...</div>;
  return <CertificatesSection certificates={data ?? []} />;
}