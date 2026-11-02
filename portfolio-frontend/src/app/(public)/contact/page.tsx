// src/app/(public)/contact/page.tsx
import type { Metadata } from "next";
import { ContactSection } from "@/components/public/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Manoj Sunar — freelance, full-time, or consulting.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <main><ContactSection /></main>;
}