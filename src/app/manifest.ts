import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { assetPath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} · coffee and { code }`,
    short_name: profile.firstName,
    description: `${profile.name}'s portfolio.`,
    start_url: assetPath("/"),
    scope: assetPath("/"),
    display: "standalone",
    background_color: "#fff8ee",
    theme_color: "#f9c2d4",
    icons: [
      { src: assetPath("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: assetPath("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      {
        src: assetPath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
