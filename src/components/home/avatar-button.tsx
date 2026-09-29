"use client";

import { useRef, useState } from "react";
import { CatAvatar } from "@/components/mascot/cat";

/** The avatar is a button: press it and the cat says something. */
export function AvatarButton({ lines }: { lines: string[] }) {
  const [said, setSaid] = useState<string | null>(null);
  const next = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const speak = () => {
    const line = lines[next.current % lines.length] ?? "";
    next.current += 1;
    setSaid(line);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaid(null), 1800);
  };

  return (
    <div className="relative mx-auto w-[168px] sm:w-[216px]">
      <button
        type="button"
        onClick={speak}
        aria-label="Say hi to my cat"
        className="group block aspect-square w-full rounded-full transition-transform duration-300 motion-safe:hover:-rotate-3"
      >
        <span
          aria-hidden="true"
          className="absolute -inset-3 rounded-full border-2 border-dashed border-accent/60 motion-safe:animate-[spin_40s_linear_infinite]"
        />
        <CatAvatar
          blink
          className="motion-safe:animate-float relative size-full drop-shadow-[0_18px_28px_rgb(204_58_116/0.3)]"
        />
      </button>
      <p
        aria-live="polite"
        className={`pointer-events-none absolute -top-2 -right-3 rounded-[16px_16px_16px_4px] border border-border bg-card px-3 py-1.5 font-heading text-sm font-semibold whitespace-nowrap text-primary shadow-soft transition-[opacity,transform] duration-200 dark:text-foreground ${
          said ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {said ?? ""}
      </p>
    </div>
  );
}
