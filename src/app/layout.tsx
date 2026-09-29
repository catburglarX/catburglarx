import type { Metadata, Viewport } from "next";
import { Fredoka, JetBrains_Mono, Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { Background } from "@/components/layout/background";
import { Dock } from "@/components/layout/dock";
import { Footer } from "@/components/layout/footer";
import { TopBar } from "@/components/layout/top-bar";
import { AppProvider } from "@/components/providers/app-provider";
import { profile } from "@/data/profile";
import { assertValidProfile } from "@/data/validate";
import { getProjects } from "@/lib/projects";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import "./globals.css";

// All three are variable fonts, so one file per family covers every weight.
// The mono font is not preloaded: it is only used for small labels and code.
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const ogAlt = `${profile.name}, ${profile.role}. coffee and { code }`;
const description = `${profile.name} is a first-year computer science student at Poornima College of Engineering, Jaipur. She knows HTML and CSS, is learning Python, and built Maanak. Open to internships and hackathon teams.`;

export const metadata: Metadata = {
  // Includes the base path, so generated image URLs land under /catburglarx.
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: `${profile.name} · coffee and { code }`,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: absoluteUrl("/") }],
  creator: profile.name,
  keywords: [
    profile.name,
    profile.handle,
    "portfolio",
    "B.Tech CSE",
    "Poornima College of Engineering",
    "Maanak",
    "developer",
    "internship",
  ],
  referrer: "strict-origin-when-cross-origin",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: absoluteUrl("/"),
    siteName: profile.name,
    title: `${profile.name} · coffee and { code }`,
    description,
    images: [{ url: "og.png", width: 1200, height: 630, alt: ogAlt, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · coffee and { code }`,
    description,
    creator: `@${profile.handle}`,
    images: [{ url: "og.png", alt: ogAlt }],
  },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1418" },
  ],
};

// Runs before first paint so the page never flashes the wrong theme.
// scripts/csp.mjs hashes it into the Content-Security-Policy.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.add("js");r.classList.toggle("dark",d);if(t){var c=d?"#1b1418":"#fff8ee";document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",c)})}}catch(e){}})();`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  assertValidProfile();
  const projects = (await getProjects()).map(({ slug, title, tags }) => ({ slug, title, tags }));
  return (
    <html
      lang="en-IN"
      // The theme script sets the class before React loads.
      suppressHydrationWarning
      className={`${fredoka.variable} ${nunito.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[200] -translate-y-24 rounded-control bg-foreground px-4 py-3 font-extrabold text-background no-underline transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <AppProvider
          contact={{ email: profile.email, socials: profile.socials }}
          projects={projects}
        >
          <Background />
          <TopBar />
          {children}
          <Footer />
          <Dock />
        </AppProvider>
      </body>
    </html>
  );
}
