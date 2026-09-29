"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/providers/app-provider";
import { buttonStyles } from "@/components/ui/styles";

/** Opens the command menu. Used on the 404 page, where a shortcut alone won't help on a phone. */
export function SearchButton({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  const { openCommand } = useApp();
  return (
    <button
      type="button"
      onClick={openCommand}
      aria-haspopup="dialog"
      className={buttonStyles.ghost}
    >
      {icon}
      {children}
    </button>
  );
}
