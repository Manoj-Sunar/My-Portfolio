// src/app/error.tsx
"use client";
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-4xl font-bold mb-4">Something went wrong</h1>
      <button onClick={reset} className="rounded-full bg-primary text-primary-foreground px-6 py-3 mt-4">Try again</button>
    </main>
  );
}