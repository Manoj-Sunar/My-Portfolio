// src/app/not-found.tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-6xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">This page does not exist.</p>
      <Link href="/" className="rounded-full bg-primary text-primary-foreground px-6 py-3">Go Home</Link>
    </main>
  );
}