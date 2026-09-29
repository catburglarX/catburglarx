import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";
import { highlight } from "@/lib/shiki";

function toSource(): string {
  const value = (v: string | string[]) =>
    Array.isArray(v) ? `[${v.map((s) => JSON.stringify(s)).join(", ")}]` : JSON.stringify(v);
  const fields = Object.entries(profile.aboutCode).map(([k, v]) => `  ${k}: ${value(v)},`);
  return [
    "// nice to meet you",
    `const ${profile.firstName.toLowerCase()} = {`,
    ...fields,
    "} as const;",
    "",
    `export default ${profile.firstName.toLowerCase()};`,
  ].join("\n");
}

export async function About() {
  const html = await highlight(toSource(), "ts");
  return (
    <section id="about" aria-labelledby="about-title" className="pt-16">
      <SectionHeading id="about" title="about" />
      <div className="grid gap-4 md:grid-cols-2">
        <BlurFade className="card space-y-3 p-6">
          {profile.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </BlurFade>
        <BlurFade delay={0.08} className="card overflow-hidden">
          <figure>
            <figcaption className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-[#ff8fb1]" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-[#ffd479]" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-[#7fd8c1]" />
              <span className="ml-auto font-mono text-xs text-muted-foreground">about-me.ts</span>
            </figcaption>
            {/* Highlighted at build time by Shiki. The input is my own profile data, not user input. */}
            <div className="[&_pre]:rounded-none" dangerouslySetInnerHTML={{ __html: html }} />
          </figure>
        </BlurFade>
      </div>
    </section>
  );
}
