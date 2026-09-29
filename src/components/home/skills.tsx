import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";
import { assetPath } from "@/lib/site";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="pt-16">
      <SectionHeading
        id="skills"
        title="skills"
        intro="What I can use today, and what I'm learning now."
      />
      <BlurFade className="card grid gap-6 p-6 sm:grid-cols-3">
        {profile.skills.map((group) => (
          <div key={group.group}>
            <h3 className="mb-3 font-mono text-sm font-bold text-muted-foreground">
              {group.group}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li
                  key={skill.name}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background py-1.5 pr-4 pl-2 text-[0.9375rem] font-bold motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
                >
                  {skill.logo ? (
                    <span className="grid size-7 place-items-center rounded-full bg-white">
                      <Image
                        src={assetPath(`/tech/${skill.logo}`)}
                        alt=""
                        width={18}
                        height={18}
                        unoptimized
                        className="size-[18px]"
                      />
                    </span>
                  ) : (
                    <span aria-hidden="true" className="ml-1 size-2 rounded-full bg-blush" />
                  )}
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </BlurFade>
    </section>
  );
}
