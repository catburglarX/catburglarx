import type { ImageLoaderProps } from "next/image";

const AVAILABLE = [64, 128, 256, 640, 960, 1280];

// Maps a next/image request to a file written by scripts/process-assets.mjs.
// `src` is the image name without size or extension, e.g. "/images/poornima".
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const size = AVAILABLE.find((w) => w >= width) ?? AVAILABLE[AVAILABLE.length - 1];
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}-${size}.webp`;
}
