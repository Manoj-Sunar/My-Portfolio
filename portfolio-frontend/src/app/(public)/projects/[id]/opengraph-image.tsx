// src/app/(public)/projects/[id]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getProject } from "@/lib/server-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project";

export default async function OG({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProject(id).catch(() => null);
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end",
        width: "100%", height: "100%", padding: 64,
        background: "#0a0a0a", color: "#fff" }}>
        <div style={{ fontSize: 28, color: "#a3a3a3", marginBottom: 16 }}>{p?.category ?? "Project"}</div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>{p?.title ?? "Not found"}</div>
        <div style={{ marginTop: 32, fontSize: 24, color: "#a3a3a3" }}>manojkami.com.np</div>
      </div>
    ),
    size
  );
}