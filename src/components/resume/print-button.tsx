"use client";

import { Printer } from "lucide-react";
import { buttonStyles } from "@/components/ui/styles";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonStyles.ghost}>
      <Printer aria-hidden="true" className="size-4" strokeWidth={2.25} />
      Print
    </button>
  );
}
