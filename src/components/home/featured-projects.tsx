import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProjects } from "@/lib/projects";

export async function FeaturedProjects() {
  const projects = (await getProjects()).filter((p) => p.featured);
  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-16">
      <SectionHeading
        id="projects"
        title="projects"
        intro="The work I'm proudest of so far. Each one has a case study with the numbers."
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((project, i) => (
          <li key={project.slug} className={projects.length === 1 ? "md:col-span-2" : undefined}>
            <BlurFade delay={(i % 2) * 0.08} className="h-full">
              <ProjectCard project={project} />
            </BlurFade>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center">
        <Link href="/projects/" className="link inline-flex min-h-11 items-center gap-1.5">
          See all projects
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.25} />
        </Link>
      </p>
    </section>
  );
}
