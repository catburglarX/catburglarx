"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Horizontal scroller that starts at the right, so the newest weeks show first on phones. */
export function ScrollToEnd({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      // Focusable so keyboard users can scroll it with the arrow keys.
      tabIndex={0}
      className="overflow-x-auto rounded-md pb-2"
    >
      {children}
    </div>
  );
}
