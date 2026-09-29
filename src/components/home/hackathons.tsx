import { ArrowRight, ExternalLink, Users } from "lucide-react";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { LogoTile } from "@/components/ui/logo-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";

export function Hackathons() {
  return (
    <section id="hackathons" aria-labelledby="hackathons-title" className="pt-16">
      <SectionHeading
        id="hackathons"
        title="hackathons"
        intro="Hackathons I've been part of, and what I want next."
      />
      <ol className="relative grid gap-4 before:absolute before:top-6 before:bottom-6 before:left-[27px] before:w-0.5 before:bg-[repeating-linear-gradient(to_bottom,var(--blush)_0_6px,transparent_6px_12px)]">
        {profile.events.map((event) => (
          <li key={event.title} className="relative grid grid-cols-[56px_1fr] items-start gap-4">
            <span className="relative z-10 grid size-14 place-items-center rounded-full border border-border bg-card shadow-soft">
              {event.logo ? <LogoTile name={event.logo} size={44} /> : null}
            </span>
            <BlurFade className="card px-5 py-4">
              <p className="font-mono text-xs text-muted-foreground">{event.when}</p>
              <h3 className="mt-0.5 text-lg">{event.title}</h3>
              <p className="mt-1 text-[0.9375rem] text-muted-foreground">{event.description}</p>
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link mt-1 inline-flex min-h-11 items-center gap-1 text-sm"
                >
                  {new URL(event.url).hostname.replace(/^www\./, "")}
                  <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </BlurFade>
          </li>
        ))}
        <li className="relative grid grid-cols-[56px_1fr] items-start gap-4">
          <span className="relative z-10 grid size-14 place-items-center rounded-full border-2 border-dashed border-blush bg-background text-primary">
            <Users aria-hidden="true" className="size-5" strokeWidth={2} />
          </span>
          <BlurFade className="rounded-card border-2 border-dashed border-border px-5 py-4">
            <p className="font-mono text-xs text-muted-foreground">next</p>
            <h3 className="mt-0.5 text-lg">My next hackathon</h3>
            <p className="mt-1 text-[0.9375rem] text-muted-foreground">{profile.lookingForTeam}</p>
            <Link
              href="/#contact"
              className="link mt-1 inline-flex min-h-11 items-center gap-1 text-sm"
            >
              Ask me to join
              <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
            </Link>
          </BlurFade>
        </li>
      </ol>
    </section>
  );
}
