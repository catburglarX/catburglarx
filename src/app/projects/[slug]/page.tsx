import { ArrowLeft, ArrowUpRight, Code2, Globe } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/projects/mdx";
import { buttonStyles } from "@/components/ui/styles";
import { image } from "@/lib/images";
import { getProject, getProjects } from "@/lib/projects";
import { absoluteUrl } from "@/lib/site";
import { formatMonth } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: absoluteUrl(`/projects/${project.slug}/`) },
  };
}

const STATUS = { active: "Active", complete: "Complete", archived: "Archived" } as const;

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const cover = image(project.cover);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-[min(760px,calc(100%-40px))] pt-10 outline-none"
    >
      <Link href="/projects/" className="link inline-flex min-h-11 items-center gap-1.5 text-sm">
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2.25} />
        All projects
      </Link>

      <article>
        <header className="mt-4">
          <h1 className="text-4xl sm:text-5xl">{project.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>
          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="font-bold text-muted-foreground">Started</dt>
              <dd>
                <time dateTime={project.date}>{formatMonth(project.date)}</time>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-bold text-muted-foreground">Status</dt>
              <dd>{STATUS[project.status]}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            {project.links.code && (
              <a
                href={project.links.code}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles.primary}
              >
                <Code2 aria-hidden="true" className="size-4" strokeWidth={2.25} />
                Code on GitHub
                <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.25} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles.ghost}
              >
                <Globe aria-hidden="true" className="size-4" strokeWidth={2.25} />
                Live site
                <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.25} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </header>

        <figure className="card mt-8 overflow-hidden">
          <Image
            src={cover.src}
            width={cover.width}
            height={cover.height}
            alt={project.coverAlt}
            placeholder="blur"
            blurDataURL={cover.blurDataURL}
            sizes="(min-width: 768px) 760px, 100vw"
            priority
            className="h-auto w-full"
          />
        </figure>

        <section aria-labelledby="stack-title" className="mt-8">
          <h2 id="stack-title" className="font-mono text-sm font-bold text-muted-foreground">
            Built with
          </h2>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm font-bold"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="text-[1.0625rem] leading-[1.75]">
          <Mdx source={project.body} />
        </div>
      </article>
    </main>
  );
}
