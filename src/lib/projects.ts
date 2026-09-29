import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { isImageKey } from "./images";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

const imageKey = z.string().refine(isImageKey, {
  message: "cover must be a key in src/generated/images.json",
});

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(20).max(260),
  // YAML turns an unquoted date into a Date, so accept both and keep YYYY-MM-DD.
  date: z
    .union([z.date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)])
    .transform((d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d)),
  tags: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string().min(1)).min(1),
  links: z
    .object({
      live: z.url().optional(),
      code: z.url().optional(),
    })
    .strict(),
  cover: imageKey,
  coverAlt: z.string().min(10),
  featured: z.boolean().default(false),
  status: z.enum(["active", "complete", "archived"]),
});

export type ProjectMeta = z.infer<typeof frontmatterSchema>;
export interface Project extends ProjectMeta {
  body: string;
}

function split(file: string, raw: string): { data: unknown; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`${file} has no frontmatter block`);
  return { data: parseYaml(match[1] ?? ""), body: match[2] ?? "" };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith(".mdx"));
  const projects = await Promise.all(
    files.map(async (file) => {
      const { data, body } = split(file, await readFile(path.join(PROJECTS_DIR, file), "utf8"));
      const result = frontmatterSchema.safeParse(data);
      if (!result.success) {
        throw new Error(`Invalid frontmatter in ${file}:\n${z.prettifyError(result.error)}`);
      }
      if (`${result.data.slug}.mdx` !== file) {
        throw new Error(`${file}: slug "${result.data.slug}" must match the file name`);
      }
      return { ...result.data, body };
    }),
  );
  // Featured first, then newest first.
  return projects.sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date),
  );
});

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getAllTags(): Promise<string[]> {
  const tags = new Set((await getProjects()).flatMap((p) => p.tags));
  return [...tags].sort((a, b) => a.localeCompare(b));
}
