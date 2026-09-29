import OpengraphImage from "./opengraph-image";
import { profile } from "@/data/profile";

// Segment config has to be written out here; Next reads it statically.
export const dynamic = "force-static";
export const alt = `${profile.name}, ${profile.role}. coffee and { code }`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
