import Image from "next/image";
import { image } from "@/lib/images";

/** Screenshot used inside MDX case studies: `<Screenshot image="maanak-rules" alt="..." caption="..." />`. */
export function Screenshot({
  image: key,
  alt,
  caption,
}: {
  image: string;
  alt: string;
  caption?: string;
}) {
  const img = image(key);
  return (
    <figure className="card my-8 overflow-hidden">
      <Image
        src={img.src}
        width={img.width}
        height={img.height}
        alt={alt}
        placeholder="blur"
        blurDataURL={img.blurDataURL}
        sizes="(min-width: 768px) 760px, 100vw"
        className="h-auto w-full"
      />
      {caption && (
        <figcaption className="border-t border-border px-5 py-3 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
