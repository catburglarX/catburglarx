"use client";

import { useEffect } from "react";
import { Toaster as Sonner, toast } from "sonner";

export default function Toaster({
  onReady,
}: {
  onReady: (toast: (message: string) => void) => void;
}) {
  useEffect(() => {
    onReady((message) => toast(message));
  }, [onReady]);

  return (
    <Sonner
      position="bottom-center"
      offset={96}
      mobileOffset={84}
      duration={2600}
      visibleToasts={3}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-2 rounded-full bg-tooltip px-5 py-3 text-sm font-bold text-tooltip-foreground shadow-lift",
        },
      }}
    />
  );
}
