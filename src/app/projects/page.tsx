import type { Metadata } from "next";
import { ProjectFilter } from "@/components/projects/project-filter";
import { Braces } from "@/components/ui/section-heading";
import { getAllTags, getProjects } from "@/lib/projects";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Everything Antra Kumari has built, with a write-up for each project.",
  alternates: { canonical: absoluteUrl("/projects/") },
};

export default async function ProjectsPage() {
  const [projects, tags] = await Promise.all([getProjects(), getAllTags()]);
  // The client filter only needs metadata, not the MDX bodies.
  const metas = projects.map(({ body, ...meta }) => meta);
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-[min(820px,calc(100%-40px))] pt-12 outline-none"
    >
      <h1 className="text-4xl sm:text-5xl">
        <Braces>projects</Braces>
      </h1>
      <p className="mt-3 mb-8 max-w-[60ch] text-muted-foreground">
        Everything I&apos;ve built. Pick a tag to filter. I&apos;m in my first year, so the list is
        short for now.
      </p>
      <ProjectFilter projects={metas} tags={tags} />
    </main>
  );
}
