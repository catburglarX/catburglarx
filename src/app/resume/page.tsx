import { Download } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PrintButton } from "@/components/resume/print-button";
import { buttonStyles } from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { getProjects } from "@/lib/projects";
import { absoluteUrl, assetPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name}, ${profile.role.toLowerCase()}.`,
  alternates: { canonical: absoluteUrl("/resume/") },
};

// What the résumé says about each project. Kept short so the page fits on one A4 sheet.
const HIGHLIGHTS: Record<string, string[]> = {
  maanak: [
    "A web app that checks packaged goods from a photo. It reads labels in English and Hindi and makes a locked report.",
    "It never guesses when something is missing. Across 14 real packet photos, it raised 0 violations before an officer checked them.",
    "321 unit tests, no accessibility errors on 14 public pages, and 7 automatic checks on every push.",
  ],
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 print:mt-4">
      <h2 className="border-b border-border pb-1 font-mono text-sm font-bold text-primary print:text-[10pt]">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default async function ResumePage() {
  const projects = (await getProjects()).filter((p) => p.featured);
  const contacts = [
    { label: profile.email, href: `mailto:${profile.email}` },
    ...profile.socials
      .filter((s) => s.name === "GitHub" || s.name === "LinkedIn")
      .map((s) => ({ label: s.url.replace(/^https:\/\/(www\.)?/, ""), href: s.url })),
    { label: absoluteUrl("/").replace(/^https:\/\//, ""), href: absoluteUrl("/") },
  ];

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-[min(820px,calc(100%-40px))] pt-10 outline-none print:w-full print:pt-0"
    >
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground">Fits on one A4 page.</p>
        <div className="flex flex-wrap gap-3">
          <a href={assetPath(profile.resumePdf)} download className={buttonStyles.primary}>
            <Download aria-hidden="true" className="size-4" strokeWidth={2.25} />
            Download PDF
          </a>
          <PrintButton />
        </div>
      </div>

      <article className="card p-6 text-[0.9375rem] leading-relaxed sm:p-10 print:rounded-none print:border-0 print:p-0 print:text-[10pt] print:leading-snug print:shadow-none">
        <header>
          <h1 className="text-4xl print:text-[22pt]">{profile.name}</h1>
          <p className="mt-1 font-bold text-muted-foreground">
            {profile.role} · {profile.location} · {profile.pronouns}
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm print:text-[9pt]">
            {contacts.map((c) => (
              <li key={c.href}>
                <a href={c.href} className="link">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <Section title="Summary">
          <p>{profile.bio}</p>
        </Section>

        <Section title="Education">
          <ul className="space-y-1.5">
            {profile.education.map((e) => (
              <li key={e.school} className="flex flex-wrap justify-between gap-x-4">
                <span>
                  <strong>{e.school}</strong>, {e.detail}
                </span>
                <span className="font-mono text-sm text-muted-foreground print:text-[9pt]">
                  {e.period}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Projects">
          {projects.map((p) => (
            <div key={p.slug} className="mb-2">
              <p className="flex flex-wrap justify-between gap-x-4">
                <span>
                  <strong>{p.title}</strong>
                  {p.links.code && (
                    <>
                      {" · "}
                      <a href={p.links.code} className="link">
                        {p.links.code.replace(/^https:\/\//, "")}
                      </a>
                    </>
                  )}
                </span>
                <span className="font-mono text-sm text-muted-foreground print:text-[9pt]">
                  {p.stack.slice(0, 4).join(", ")}
                </span>
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 marker:text-blush">
                {(HIGHLIGHTS[p.slug] ?? [p.summary]).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="Skills">
          <ul className="space-y-1">
            {profile.skills.map((g) => (
              <li key={g.group}>
                <strong>{g.group}:</strong> {g.items.map((s) => s.name).join(", ")}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Hackathons">
          <ul className="space-y-1">
            {profile.events.map((e) => (
              <li key={e.title}>
                <strong>{e.title}</strong>. {e.description.replace(/\.$/, "")}.
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </main>
  );
}
