"use client";

import { useShortcutLabel } from "./command-button";

/** "Ctrl K" or "⌘K", whichever matches the visitor's computer. */
export function ShortcutKey() {
  const shortcut = useShortcutLabel();
  return (
    <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 text-xs font-bold text-foreground">
      {shortcut}
    </kbd>
  );
}
