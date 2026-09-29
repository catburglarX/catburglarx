"use client";

import type { ReactNode } from "react";
import { useApp } from "@/components/providers/app-provider";
import { buttonStyles } from "@/components/ui/styles";

export function CopyEmailButton({ icon }: { icon: ReactNode }) {
  const { copyEmail } = useApp();
  return (
    <button type="button" onClick={() => void copyEmail()} className={buttonStyles.ghost}>
      {icon}
      Copy email
    </button>
  );
}
