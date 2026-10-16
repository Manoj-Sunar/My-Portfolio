"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Menu, X, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Monitor,
  Code2,
  Terminal,
  Palette,
  Search,
  MonitorPlay,
} from "lucide-react";

const mainLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/education", label: "Education" },
  { href: "/cv", label: "Resume" },
];

const serviceItems = [
  {
    href: "/services#uiux",
    title: "UI/UX Design",
    description: "Custom UIUX Design for websites",
    icon: Monitor,
    featured: true,
  },
  {
    href: "/services#web-mobile",
    title: "Website & Mobile app",
    description: "Web and mobile app developments",
    icon: Code2,
  },
  {
    href: "/services#software",
    title: "Custom Software",
    description: "Custom software designed to fit",
    icon: Terminal,
  },
  {
    href: "/services#branding",
    title: "Branding",
    description: "Visual brand identities created",
    icon: Palette,
  },
  {
    href: "/services#seo",
    title: "SEO",
    description: "SEO and search growth for sites",
    icon: Search,
  },
  {
    href: "/services#training",
    title: "Training and Consultation",
    description: "Expert tech consulting services",
    icon: MonitorPlay,
  },
];

function NavbarInner() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close dropdown when clicking elsewhere
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-services-menu]")) setServicesOpen(false);
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const activeServices =
    pathname === "/services" || pathname.startsWith("/services");

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || servicesOpen
            ? "bg-background border-b border-border/60 shadow-sm"
            : "bg-background border-b border-border/30"
        }`}
      >
        <nav className="container-custom px-6 md:px-10 h-20 flex items-center justify-between">
          {/* ── LOGO ── */}
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight leading-none flex items-baseline gap-1"
            onClick={() => {
              setOpen(false);
              setServicesOpen(false);
            }}
          >
            <span className="text-primary">MANOJ</span>
            <span className="text-foreground/70 text-sm font-medium tracking-[0.3em] uppercase">
              Dev
            </span>
          </Link>

          {/* ── CENTER NAV (desktop) ── */}
          <ul className="hidden lg:flex items-center gap-9 text-[15px]">
            {/* Services with MEGA dropdown */}
            <li className="relative" data-services-menu>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setServicesOpen((v) => !v);
                }}
                onMouseEnter={() => setServicesOpen(true)}
                className={`flex items-center gap-1.5 transition-colors py-3 ${
                  activeServices || servicesOpen
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </li>

            {mainLinks.map((l) => {
              const active =
                pathname === l.href ||
                (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`transition-colors ${
                      active
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}

            {/* Vertical divider */}
            <li aria-hidden className="w-px h-6 bg-border" />

            {/* Standalone item */}
            <li>
              <Link
                href="/projects"
                className="text-foreground hover:text-primary transition-colors"
              >
                Portfolio
              </Link>
            </li>
          </ul>

          {/* ── RIGHT — CONTACT button ── */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 border border-primary text-primary px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              style={{ borderRadius: 0 }}
            >
              Contact
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* ── MOBILE toggle ── */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="h-6 w-6" strokeWidth={1.75} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            )}
          </button>
        </nav>

        {/* ── MEGA DROPDOWN (desktop only) ── */}
        <AnimatePresence>
          {servicesOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onMouseLeave={() => setServicesOpen(false)}
              className="hidden lg:block absolute left-0 right-0 top-full"
              data-services-menu
            >
              <div className="container-custom px-6 md:px-10">
                <div
                  className="bg-background border border-border/60 shadow-2xl mx-auto"
                  style={{
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    maxWidth: 1100,
                  }}
                >
                  {/* Panel header */}
                  <div className="px-10 pt-7 pb-4 border-b border-border/40">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      Services
                    </span>
                  </div>

                  {/* Grid: 2 columns */}
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-2 gap-2">
                      {serviceItems.map((item) => {
                        const Icon = item.icon;
                        const isHovered = hoveredItem === item.title;
                        const isFeatured = item.featured;

                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setServicesOpen(false)}
                            onMouseEnter={() => setHoveredItem(item.title)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`group flex items-start gap-4 p-4 transition-all duration-200 ${
                              isHovered || isFeatured
                                ? "bg-muted/60"
                                : "bg-transparent hover:bg-muted/60"
                            }`}
                          >
                            {/* Icon */}
                            <div className="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5 text-foreground">
                              <Icon
                                className="h-5 w-5"
                                strokeWidth={1.75}
                              />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4
                                  className={`text-[15px] font-semibold leading-tight ${
                                    isHovered
                                      ? "text-primary"
                                      : "text-foreground"
                                  }`}
                                >
                                  {item.title}
                                </h4>
                                {isHovered && (
                                  <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-[13px] text-muted-foreground leading-snug mt-1">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 z-40 bg-background"
          >
            <div className="h-full flex flex-col pt-24 pb-8 px-6 overflow-y-auto">
              <ul className="space-y-6">
                <li>
                  <span className="text-xs font-mono text-muted-foreground/60 block mb-3">
                    01
                  </span>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer font-display text-3xl font-bold text-foreground hover:text-primary transition-colors list-none">
                      Services
                      <ChevronDown className="h-6 w-6 group-open:rotate-180 transition-transform" />
                    </summary>
                    <ul className="mt-4 space-y-3 pl-4 border-l border-border/60">
                      {serviceItems.map((item) => (
                        <li key={item.title}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-start gap-3 py-2"
                          >
                            <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div>
                              <div className="font-semibold text-foreground">
                                {item.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>

                {mainLinks.map((l, i) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 group"
                    >
                      <span className="text-xs font-mono text-muted-foreground/60 tabular-nums">
                        {String(i + 2).padStart(2, "0")}
                      </span>
                      <span className="font-display text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {l.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-8 border-t border-border/50">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ borderRadius: 0 }}
                >
                  Contact
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavbarSkeleton() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border/40">
      <nav className="container-custom px-6 md:px-10 h-20 flex items-center justify-between">
        <div className="font-display text-2xl font-bold tracking-tight">
          <span className="text-primary">MANOJ</span>
          <span className="text-foreground/70 text-sm font-medium tracking-[0.3em] uppercase ml-1">
            Dev
          </span>
        </div>
        <div className="w-10 h-10 lg:hidden" />
      </nav>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarInner />
    </Suspense>
  );
}