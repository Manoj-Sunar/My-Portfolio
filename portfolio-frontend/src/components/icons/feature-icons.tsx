import { SVGProps } from "react";

export function PlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M58 6L32 32M58 6l-14 52-12-26L6 20 58 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M32 32l-8 10 12-3-4-7z"
        fill="currentColor"
        opacity="0.15"
      />
    </svg>
  );
}

export function BoxStackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="8" y="24" width="28" height="32" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 34h28" stroke="currentColor" strokeWidth="2" />
      <rect x="32" y="36" width="24" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="36" y="18" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M40 22v8M48 22v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 24v-6a2 2 0 012-2h14" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function RocketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M32 8c8 4 12 14 12 24L32 44l-12-12C20 22 24 12 32 8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="24" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M20 32l-6 6 8 2M44 32l6 6-8 2M28 44l4 12 4-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M32 8l20 8v16c0 12-8 20-20 24-12-4-20-12-20-24V16l20-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M22 32l8 8 14-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="24" cy="22" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="44" cy="24" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M10 52c0-8 6-14 14-14s14 6 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M38 46c2-6 6-8 10-8 6 0 8 4 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22 20L10 32l12 12M42 20l12 12-12 12M36 14l-8 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}