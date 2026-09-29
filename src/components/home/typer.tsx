"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/stores";

const TYPE_MS = 70;
const DELETE_MS = 30;
const HOLD_MS = 1800;
const GAP_MS = 400;

/**
 * Types each line, holds it, deletes it and moves on. The box is as wide as
 * the longest line, so nothing around it moves while it types. Screen readers
 * get the plain first line; the animated copy is hidden from them.
 */
export function Typer({ lines }: { lines: string[] }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const first = lines[0] ?? "";
  const [text, setText] = useState(first);
  const paused = useRef(false);
  const longest = Math.max(...lines.map((l) => l.length));

  useEffect(() => {
    if (reducedMotion) return;
    let line = 0;
    let chars = first.length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (paused.current || document.hidden) {
        timer = setTimeout(tick, 250);
        return;
      }
      const current = lines[line] ?? "";
      if (deleting) {
        chars -= 1;
        setText(current.slice(0, Math.max(chars, 0)));
        if (chars <= 0) {
          deleting = false;
          line = (line + 1) % lines.length;
          timer = setTimeout(tick, GAP_MS);
          return;
        }
        timer = setTimeout(tick, DELETE_MS);
        return;
      }
      chars += 1;
      setText(current.slice(0, chars));
      if (chars >= current.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD_MS);
        return;
      }
      timer = setTimeout(tick, TYPE_MS + Math.random() * 40);
    };

    // The first line is already on screen from the server, so start by holding it.
    timer = setTimeout(tick, HOLD_MS);
    return () => clearTimeout(timer);
  }, [lines, first, reducedMotion]);

  return (
    <p
      className="inline-flex items-center font-mono text-[1rem] font-semibold sm:text-[1.125rem]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <span className="sr-only">{first}</span>
      <span aria-hidden="true" className="flex items-center">
        <span className="font-bold text-brace">{"{"}</span>
        <span
          className="relative ml-2 inline-flex h-[1.6em] items-center overflow-hidden whitespace-pre"
          style={{ width: `${longest + 1}ch` }}
        >
          {reducedMotion ? first : text}
          <span className="ml-px inline-block h-[1.1em] w-0.5 bg-primary motion-safe:animate-[caret_1s_steps(1)_infinite]" />
        </span>
        <span className="font-bold text-brace">{"}"}</span>
      </span>
    </p>
  );
}
