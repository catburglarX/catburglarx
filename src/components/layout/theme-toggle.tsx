"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/providers/app-provider";
import { iconButton } from "@/components/ui/styles";

/**
 * The moon and sun arrive as server-rendered children, so no icon code ships
 * for them. Both render and CSS picks one, so the HTML matches either theme.
 */
export function ThemeToggle({ moon, sun }: { moon: ReactNode; sun: ReactNode }) {
  const { theme, toggleTheme } = useApp();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={iconButton}
      aria-label="Dark theme"
      // Unknown on the server, so aria-pressed only appears once the theme is read.
      aria-pressed={theme === null ? undefined : theme === "dark"}
      title="Switch theme"
    >
      <span className="contents dark:hidden">{moon}</span>
      <span className="hidden dark:contents">{sun}</span>
    </button>
  );
}
