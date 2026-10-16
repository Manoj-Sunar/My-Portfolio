"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X, ChevronDown, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const SERVICES_OPTIONS = [
  "UI/UX Design",
  "Website & Mobile app",
  "SEO",
  "Branding",
  "Custom Software",
  "Training & Consultation",
];

const inputBase =
  "w-full border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/40 transition-colors";

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(["UI/UX"]);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+977");

  const removeService = (s: string) =>
    setSelectedServices((prev) => prev.filter((x) => x !== s));
  const addService = (s: string) => {
    if (!selectedServices.includes(s))
      setSelectedServices((prev) => [...prev, s]);
    setServicesOpen(false);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
      setSelectedServices([]);
    }, 900);
  };

  return (
    <main className="bg-background">
      {/* ═════════════ HERO ═════════════ */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-muted-foreground mb-6 block">
            Contact&nbsp;&nbsp;&nbsp;Us
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground">
            Have a Project in mind?
            <br />
            We&apos;d love to help
          </h1>
        </motion.div>
      </section>

      {/* ═════════════ FORM SECTION ═════════════ */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section label */}
          <div className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3 block">
              New&nbsp;&nbsp;Request
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-foreground max-w-2xl">
              Fill out the form, and our expert will contact you.
            </h2>
          </div>

          {/* ── 2-COLUMN LAYOUT ── */}
          <div className="grid lg:grid-cols-3 gap-10 xl:gap-14">
            {/* ───────── LEFT — FORM (2/3) ───────── */}
            <form
              onSubmit={submit}
              className="lg:col-span-2 space-y-6"
            >
              {/* Row 1 — Full Name + Email */}
              <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    className={inputBase}
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className={inputBase}
                  />
                </Field>
              </div>

              {/* Row 2 — Phone + Organization */}
              <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                <Field label="Phone Number" required>
                  <div className="flex items-stretch border border-border bg-background">
                    <div className="relative flex items-center gap-2 px-3 border-r border-border">
                      <span className="text-xl leading-none">
                        {countryCode === "+977" ? "🇳🇵" : countryCode === "+1" ? "🇺🇸" : "🇮🇳"}
                      </span>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Country code"
                      >
                        <option value="+977">Nepal +977</option>
                        <option value="+1">USA +1</option>
                        <option value="+91">India +91</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Enter phone number"
                      className="flex-1 bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                    />
                  </div>
                </Field>
                <Field label="Organization" required>
                  <input
                    type="text"
                    name="organization"
                    required
                    placeholder="Enter your company or organization name"
                    className={inputBase}
                  />
                </Field>
              </div>

              {/* Row 3 — Services + Budget */}
              <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                <Field label="What do need help with?" required>
                  <div className="relative">
                    <div
                      className="min-h-[50px] flex items-center justify-between gap-2 border border-border bg-background px-3 py-2 cursor-pointer"
                      onClick={() => setServicesOpen((v) => !v)}
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.length === 0 && (
                          <span className="text-sm text-muted-foreground/60 px-1">
                            Select services
                          </span>
                        )}
                        {selectedServices.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-sm bg-background"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeService(s);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label={`Remove ${s}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>

                    {servicesOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-background shadow-lg z-20">
                        {SERVICES_OPTIONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => addService(s)}
                            className="block w-full text-left px-4 py-3 text-sm hover:bg-muted/50 transition"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>
                <Field label="Estimated Budget" required>
                  <input
                    type="text"
                    name="budget"
                    required
                    placeholder="e.g. $5,000 - $10,000"
                    className={inputBase}
                  />
                </Field>
              </div>

              {/* Row 4 — Message (full width) */}
              <Field label="What can we build or solve for you?">
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Tell us more about your project, goals, and timeline..."
                  className={`${inputBase} resize-none`}
                />
              </Field>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 border border-border accent-primary shrink-0"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Select this checkbox to provide your explicit consent for us to
                  collect and process the personal data you have submitted in
                  this form, in accordance with our{" "}
                  <a href="#" className="text-primary underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 bg-[#8ab4e8] hover:bg-[#7aa5dc] text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-60"
                  style={{ borderRadius: 0 }}
                >
                  {loading ? "Submitting..." : "Submit"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* ───────── RIGHT — CONTACT INFO + MAP (1/3) ───────── */}
            <aside className="lg:col-span-1 space-y-8">
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Email</p>
                <a
                  href="mailto:kumar980062begin@gmail.com"
                  className="text-lg text-foreground hover:text-primary transition-colors break-all"
                >
                  kumar980062begin@gmail.com
                </a>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Phone</p>
                <a
                  href="tel:9764617689"
                  className="text-lg text-foreground hover:text-primary transition-colors"
                >
                  +977-9764617689
                </a>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Location</p>
                <p className="text-lg text-foreground leading-snug">
                  Pokhara, Kaski, Nepal
                </p>
              </div>

              {/* Google Map embed */}
              <div className="relative w-full aspect-[4/3] border border-border overflow-hidden">
                <iframe
                  title="Location map"
                  src="https://www.google.com/maps?q=Pokhara,+Nepal&output=embed"
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://www.google.com/maps/place/Pokhara,+Nepal"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-3 left-3 inline-flex items-center gap-2 bg-white text-[#1a73e8] px-3 py-2 text-xs font-semibold shadow-md hover:bg-white/95 transition"
                >
                  Open in Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── Helpers ─── */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}