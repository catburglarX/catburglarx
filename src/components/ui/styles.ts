import { cx } from "@/lib/utils";

// Shared control styles. Pills are fully round, 44px tall to meet touch
// target size, and each has distinct hover, pressed, focus and disabled states.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[0.9375rem] font-extrabold no-underline transition-[transform,background-color,box-shadow,color] duration-150 ease-out select-none focus-visible:outline-offset-[3px] active:translate-y-px active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-0.5";

export const buttonStyles = {
  primary: cx(base, "bg-primary text-primary-foreground shadow-button hover:bg-primary-hover"),
  ghost: cx(
    base,
    "border border-border bg-card text-foreground shadow-soft hover:border-blush hover:bg-muted",
  ),
  small:
    "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-bold text-foreground no-underline transition-colors hover:border-blush hover:bg-muted active:bg-secondary",
};

export const iconButton =
  "grid size-11 place-items-center rounded-full border border-border bg-card text-foreground transition-[transform,background-color,color] duration-150 hover:bg-muted hover:text-primary active:scale-95";
