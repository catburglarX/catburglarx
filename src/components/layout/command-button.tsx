"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useApp } from "@/components/providers/app-provider";

const subscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

export function useShortcutLabel(): string {
  const apple = useSyncExternalStore(subscribe, isApple, () => false);
  return apple ? "⌘K" : "Ctrl K";
}

export function CommandButton({ icon }: { icon: ReactNode }) {
  const { openCommand } = useApp();
  const shortcut = useShortcutLabel();
  return (
    <button
      type="button"
      onClick={openCommand}
      aria-label={`Open the command menu (${shortcut})`}
      aria-haspopup="dialog"
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:justify-start sm:pr-2 sm:pl-3.5"
    >
      {icon}
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden min-w-[3.25rem] rounded-md border border-border bg-background px-1.5 py-0.5 text-center text-xs font-bold text-muted-foreground sm:inline-block">
        {shortcut}
      </kbd>
    </button>
  );
}
