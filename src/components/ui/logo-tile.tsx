import Image from "next/image";
import { image } from "@/lib/images";

/** A school or event logo on a white tile, so logos keep their own colours in both themes. */
export function LogoTile({ name, size = 48 }: { name: string; size?: number }) {
  const img = image(name);
  const inner = size - 12;
  // Fit the logo inside the tile, keeping its shape, so next/image asks for 1x and 2x only.
  const scale = inner / Math.max(img.width, img.height);
  return (
    <span
      className="grid flex-none place-items-center overflow-hidden rounded-[14px] border border-border bg-white"
      style={{ width: size, height: size }}
    >
      <Image
        src={img.src}
        width={Math.round(img.width * scale)}
        height={Math.round(img.height * scale)}
        alt=""
      />
    </span>
  );
}
