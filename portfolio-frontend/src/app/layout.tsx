// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://manojkami.com.np";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Manoj Sunar — Full Stack Developer", template: "%s | Manoj Sunar" },
  description:
    "Full Stack Software Engineer in Pokhara, Nepal. I build production-grade web platforms with React, Next.js, Node.js, TypeScript, and PostgreSQL.",
  // ...rest of metadata from earlier...
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Manoj Sunar",
  url: SITE_URL,
  jobTitle: "Full Stack Software Engineer",
  address: { "@type": "PostalAddress", addressLocality: "Pokhara", addressCountry: "NP" },
  sameAs: [
    "https://github.com/Manoj-Sunar",
    "https://www.linkedin.com/in/manoj-kami-534357373",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${display.variable}`}
    >
      <body className="font-sans">
        {children}
        <Toaster richColors position="top-right" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}