import { z } from "zod";
import { profile } from "./profile";
import { profileSchema } from "./schema";

let checked = false;

/** Throws at build time if src/data/profile.ts breaks the schema. Called by the root layout. */
export function assertValidProfile(): void {
  if (checked) return;
  const result = profileSchema.safeParse(profile);
  if (!result.success) {
    throw new Error(`src/data/profile.ts is invalid:\n${z.prettifyError(result.error)}`);
  }
  checked = true;
}
