import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

/** Teal braces, drawn as text so they scale with the heading. Screen readers skip them. */
export function Braces({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={className}>
      <span aria-hidden="true" className="font-mono font-bold text-brace">
        {"{ "}
      </span>
      {children}
      <span aria-hidden="true" className="font-mono font-bold text-brace">
        {" }"}
      </span>
    </span>
  );
}

/**
 * The section heading is the label: `{ projects }`. There is no separate
 * eyebrow line. tabIndex -1 lets the command menu move focus here.
 */
export function SectionHeading({
  id,
  title,
  intro,
  align = "left",
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cx("mb-6", align === "center" && "text-center")}>
      <h2
        id={`${id}-title`}
        tabIndex={-1}
        className="text-[1.75rem] leading-tight outline-none sm:text-4xl"
      >
        <Braces>{title}</Braces>
      </h2>
      {intro && (
        <p
          className={cx(
            "mt-2 max-w-[60ch] text-base text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
