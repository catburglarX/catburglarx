import { BlurFade } from "@/components/ui/blur-fade";
import { LogoTile } from "@/components/ui/logo-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="pt-16">
      <SectionHeading id="education" title="education" />
      <ol className="grid gap-3">
        {profile.education.map((entry, i) => (
          <li key={entry.school}>
            <BlurFade
              delay={i * 0.06}
              className="card flex flex-wrap items-center gap-4 px-4 py-4 sm:flex-nowrap sm:px-5"
            >
              <LogoTile name={entry.logo} />
              <div className="min-w-0 flex-1">
                <h3 className="flex flex-wrap items-center gap-2 font-sans text-base font-extrabold">
                  {entry.school}
                  {entry.current && (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-xs font-bold text-accent-foreground">
                      now
                    </span>
                  )}
                </h3>
                <p className="text-[0.9375rem] text-muted-foreground">{entry.detail}</p>
              </div>
              <p className="w-full pl-16 font-mono text-xs text-muted-foreground sm:w-auto sm:pl-0 sm:text-right">
                {entry.period}
              </p>
            </BlurFade>
          </li>
        ))}
      </ol>
    </section>
  );
}
