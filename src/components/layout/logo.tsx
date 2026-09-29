import Link from "next/link";
import { CatMark } from "@/components/mascot/cat";
import { profile } from "@/data/profile";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center gap-1 rounded-full pr-2 font-heading text-[1.0625rem] font-semibold text-foreground no-underline"
    >
      <span aria-hidden="true" className="font-mono text-xl leading-none font-bold text-brace">
        {"{"}
      </span>
      <span className="mx-0.5 grid size-8 place-items-center rounded-full bg-[#ffc2d4]">
        <CatMark className="size-6" />
      </span>
      <span aria-hidden="true" className="font-mono text-xl leading-none font-bold text-brace">
        {"}"}
      </span>
      <span className="ml-2">{profile.name}</span>
    </Link>
  );
}
