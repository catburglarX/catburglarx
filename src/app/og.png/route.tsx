import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const dynamic = "force-static";

// Served as /og.png, not as a metadata route: GitHub Pages picks the
// content type from the file extension, and an extensionless image is
// served as application/octet-stream, which some link previews reject.
const size = { width: 1200, height: 630 };

// The Open Graph card: pink, my cat, my name and what I do. Built once at build time.
export async function GET() {
  const fonts = path.join(process.cwd(), "assets", "fonts");
  const [fredoka, nunito, mark] = await Promise.all([
    readFile(path.join(fonts, "fredoka-600.woff")),
    readFile(path.join(fonts, "nunito-700.woff")),
    // The favicon is the same cat in plain SVG, which next/og can draw as an image.
    readFile(path.join(process.cwd(), "src", "app", "icon.svg")),
  ]);
  const avatar = `data:image/svg+xml;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "72px 88px",
        background: "linear-gradient(135deg, #fff8ee 0%, #fde4ec 55%, #f9c2d4 100%)",
        fontFamily: "Nunito",
        color: "#2b2226",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "8px 20px",
            borderRadius: 999,
            background: "#e0f3ee",
            color: "#1b6b5c",
            fontSize: 26,
          }}
        >
          {profile.status}
        </div>
        <div style={{ fontFamily: "Fredoka", fontSize: 92, lineHeight: 1.05, marginTop: 28 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 34, marginTop: 16, color: "#7a5566" }}>{profile.role}</div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 28, fontFamily: "Fredoka" }}>
          <span>coffee and</span>
          <span style={{ color: "#2d8676", marginLeft: 12 }}>{"{"}</span>
          <span style={{ margin: "0 8px" }}>code</span>
          <span style={{ color: "#2d8676" }}>{"}"}</span>
        </div>
      </div>
      <img src={avatar} width={360} height={360} alt="" style={{ borderRadius: 80 }} />
    </div>,
    {
      ...size,
      fonts: [
        { name: "Fredoka", data: fredoka, weight: 600, style: "normal" },
        { name: "Nunito", data: nunito, weight: 700, style: "normal" },
      ],
    },
  );
}
