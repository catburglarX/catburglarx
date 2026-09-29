import { ArrowUpRight, BookOpen, Code2, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { image } from "@/lib/images";
import { formatMonth } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-extrabold no-underline transition-colors";

export function ProjectCard({
  project,
  headingLevel = "h3",
}: {
  project: ProjectMeta;
  headingLevel?: "h2" | "h3";
}) {
  const cover = image(project.cover);
  const Heading = headingLevel;
  const caseStudy = `/projects/${project.slug}/`;
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-200 hover:shadow-lift motion-safe:hover:-translate-y-1">
      <Link
        href={caseStudy}
        tabIndex={-1}
        aria-hidden="true"
        className="block overflow-hidden border-b border-border"
      >
        <Image
          src={cover.src}
          width={cover.width}
          height={cover.height}
          alt=""
          placeholder="blur"
          blurDataURL={cover.blurDataURL}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <Heading className="text-xl">
            <Link href={caseStudy} className="rounded-md no-underline hover:text-primary">
              {project.title}
            </Link>
          </Heading>
          <time
            dateTime={project.date}
            className="font-mono text-xs whitespace-nowrap text-muted-foreground"
          >
            {formatMonth(project.date)}
          </time>
        </div>
        <p className="text-[0.9375rem] text-muted-foreground">{project.summary}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Link
            href={caseStudy}
            className={`${linkClass} bg-primary text-primary-foreground hover:bg-primary-hover`}
          >
            <BookOpen aria-hidden="true" className="size-4" strokeWidth={2.25} />
            Case study<span className="sr-only">: {project.title}</span>
          </Link>
          {project.links.code && (
            <a
              href={project.links.code}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} border border-border bg-card text-foreground hover:bg-muted`}
            >
              <Code2 aria-hidden="true" className="size-4" strokeWidth={2.25} />
              Code
              <span className="sr-only"> for {project.title} on GitHub (opens in a new tab)</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} border border-border bg-card text-foreground hover:bg-muted`}
            >
              <Globe aria-hidden="true" className="size-4" strokeWidth={2.25} />
              Live<span className="sr-only"> site for {project.title} (opens in a new tab)</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
