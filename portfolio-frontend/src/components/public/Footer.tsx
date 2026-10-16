"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/brand-icons";


export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border/40 bg-card/40 backdrop-blur-sm">
      <div className="container-custom px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-2xl font-bold gradient-text mb-3">
            MANOJ.
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Full Stack Software Engineer building scalable, production-ready
            digital platforms.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/projects" className="hover:text-primary">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/cv" className="hover:text-primary">
                Resume
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <div className="flex gap-4">
            <a
              href="https://github.com/Manoj-Sunar"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full glass hover:text-primary transition"
              aria-label="GitHub"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/manoj-kami-534357373"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full glass hover:text-primary transition"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href="mailto:kumar980062begin@gmail.com"
              className="p-2 rounded-full glass hover:text-primary transition"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        © {year ?? 2026} Manoj Sunar. Built with Next.js, React Query &amp;
        Tailwind CSS.
      </div>
    </footer>
  );
}