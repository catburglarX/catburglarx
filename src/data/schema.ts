import { z } from "zod";

const url = z.url({ protocol: /^https?$/ });
const nonEmpty = z.string().trim().min(1);

export const socialSchema = z.object({
  name: z.enum(["GitHub", "LinkedIn", "Instagram", "X"]),
  handle: nonEmpty,
  url,
});

export const skillSchema = z.object({
  name: nonEmpty,
  // A file in public/tech. Leave it out and the chip shows a dot instead.
  logo: z
    .string()
    .regex(/^[\w-]+\.svg$/)
    .optional(),
});

export const educationSchema = z.object({
  school: nonEmpty,
  detail: nonEmpty,
  period: nonEmpty.optional(),
  current: z.boolean().default(false),
  // A key in src/generated/images.json.
  logo: nonEmpty,
  url: url.optional(),
});

export const eventSchema = z.object({
  title: nonEmpty,
  when: nonEmpty,
  description: nonEmpty,
  logo: nonEmpty.optional(),
  url: url.optional(),
});

export const profileSchema = z.object({
  name: nonEmpty,
  firstName: nonEmpty,
  handle: nonEmpty,
  pronouns: nonEmpty,
  role: nonEmpty,
  location: nonEmpty,
  email: z.email(),
  status: nonEmpty,
  tagline: nonEmpty,
  typedLines: z.array(nonEmpty).min(3).max(4),
  bio: nonEmpty,
  about: z.array(nonEmpty).min(1),
  aboutCode: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  catLines: z.array(nonEmpty).min(1),
  skills: z.array(z.object({ group: nonEmpty, items: z.array(skillSchema).min(1) })).min(1),
  education: z.array(educationSchema).min(1),
  events: z.array(eventSchema),
  lookingForTeam: nonEmpty,
  socials: z.array(socialSchema).min(1),
  resumePdf: z.string().regex(/^\/[\w.-]+\.pdf$/),
});

export type ProfileInput = z.input<typeof profileSchema>;
export type Social = z.infer<typeof socialSchema>;
