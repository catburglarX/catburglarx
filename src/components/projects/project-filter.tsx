"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import type { ProjectMeta } from "@/lib/projects";
import { cx } from "@/lib/utils";

export function ProjectFilter({ projects, tags }: { projects: ProjectMeta[]; tags: string[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const shown = useMemo(
    () => (tag ? projects.filter((p) => p.tags.includes(tag)) : projects),
    [projects, tag],
  );

  const chip = (value: string | null, label: string) => (
    <li key={label}>
      <button
        type="button"
        aria-pressed={tag === value}
        onClick={() => setTag(value)}
        className={cx(
          "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold transition-colors",
          tag === value
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground hover:border-blush hover:bg-muted",
        )}
      >
        {label}
      </button>
    </li>
  );

  return (
    <>
      <div className="mb-6">
        <h2 id="filter-title" className="sr-only">
          Filter by tag
        </h2>
        <ul aria-labelledby="filter-title" className="flex flex-wrap gap-2">
          {chip(null, "All")}
          {tags.map((t) => chip(t, t))}
        </ul>
      </div>
      <p aria-live="polite" className="mb-4 text-sm font-bold text-muted-foreground">
        {shown.length === 1 ? "1 project" : `${shown.length} projects`}
        {tag ? ` tagged ${tag}` : ""}
      </p>
      {shown.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {shown.map((project) => (
            <li key={project.slug} className={shown.length === 1 ? "md:col-span-2" : undefined}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="card px-6 py-10 text-center">
          <p className="font-bold">Nothing with that tag yet.</p>
          <button type="button" onClick={() => setTag(null)} className="link mt-2 min-h-11">
            Show every project
          </button>
        </div>
      )}
    </>
  );
}
