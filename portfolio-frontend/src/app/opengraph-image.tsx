// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Manoj Sunar — Full Stack Developer";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        width: "100%", height: "100%", padding: 72, background: "#0a0a0a", color: "#fff",
      }}>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>Manoj Sunar</div>
        <div style={{ fontSize: 36, color: "#a3a3a3", marginTop: 16 }}>Full Stack Software Engineer · Pokhara, Nepal</div>
        <div style={{ fontSize: 28, color: "#6b6b6b", marginTop: 48 }}>manojkami.com.np</div>
      </div>
    ),
    size
  );
}