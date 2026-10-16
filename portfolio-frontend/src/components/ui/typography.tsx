import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/* ─────────────────────────────────────────────
   Eyebrow — small uppercase tracking label
   Usage: <Eyebrow>WHO WE ARE</Eyebrow>
   ───────────────────────────────────────────── */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[11px] md:text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-6",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DisplayHeadline — the massive editorial headline
   Usage: <DisplayHeadline>A technology partner that treats your problem as its own</DisplayHeadline>
   ───────────────────────────────────────────── */
export function DisplayHeadline({
  children,
  className,
  as: Tag = "h1",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const size =
    Tag === "h1"
      ? "text-[2.5rem] md:text-6xl lg:text-7xl"
      : Tag === "h2"
      ? "text-[2rem] md:text-4xl lg:text-5xl"
      : "text-2xl md:text-3xl lg:text-4xl";

  return (
    <Tag
      className={cn(
        "font-display font-bold text-foreground tracking-[-0.03em] leading-[1.05]",
        size,
        className
      )}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   BodyText — the paragraph text, larger than before
   ───────────────────────────────────────────── */
export function BodyText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[17px] md:text-[19px] leading-[1.65] text-muted-foreground max-w-[720px]",
        className
      )}
    >
      {children}
    </p>
  );
}

/* ─────────────────────────────────────────────
   SectionTitle — used for "Serving 5+ Countries" type headings
   ───────────────────────────────────────────── */
export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-display text-xl md:text-2xl lg:text-[28px] font-semibold text-foreground tracking-[-0.02em] leading-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

/* ─────────────────────────────────────────────
   FeatureBlock — icon + title + description
   Usage: <FeatureBlock icon={...} title="..." description="..." />
   ───────────────────────────────────────────── */
export function FeatureBlock({
  icon,
  title,
  description,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-primary">
        {icon}
      </div>
      <SectionTitle>{title}</SectionTitle>
      <BodyText>{description}</BodyText>
    </div>
  );
}