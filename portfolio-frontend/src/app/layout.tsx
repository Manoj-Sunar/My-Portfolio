import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import "./globals.css";



const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Manoj Sunar — Full Stack Developer",
  description:
    "Full Stack Software Engineer specializing in React, Next.js, Node.js and scalable web platforms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ Removed "dark" — light is now the default theme
    // ✅ Added data-scroll-behavior to silence the smooth-scroll warning
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${display.variable}`}
    >
      <body className="font-sans">
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}