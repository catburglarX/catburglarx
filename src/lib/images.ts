import images from "@/generated/images.json";

export type ImageKey = keyof typeof images;

export interface ImageInfo {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
}

export function isImageKey(key: string): key is ImageKey {
  return Object.hasOwn(images, key);
}

/** Props for next/image from a key in the generated manifest. */
export function image(key: string): ImageInfo {
  if (!isImageKey(key)) {
    throw new Error(
      `Unknown image "${key}". Add it to scripts/process-assets.mjs and run pnpm assets.`,
    );
  }
  return { src: `/images/${key}`, ...images[key] };
}
