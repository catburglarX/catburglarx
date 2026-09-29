import type { CSSProperties, ReactNode } from "react";

/**
 * Blur and fade in as the block scrolls into view, like Magic UI's BlurFade.
 * This is CSS plus one shared IntersectionObserver (see <RevealObserver>),
 * not Motion: Motion in the first load cost about 50 KB gzipped and broke the
 * JavaScript budget. Reduced motion, no JavaScript and a stalled load all
 * leave the content visible (see globals.css).
 */
export function BlurFade({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
