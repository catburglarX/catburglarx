export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_ORIGIN = "https://catburglarx.github.io";
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

/** Absolute URL for a path inside the site, for canonical links, the sitemap and JSON-LD. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Path for a file in /public. next/link and next/image add the base path themselves; plain tags do not. */
export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}

/** The home page sections, in page order. The dock, command menu and sitemap read this. */
export const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "activity", label: "GitHub activity" },
  { id: "hackathons", label: "Hackathons" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
