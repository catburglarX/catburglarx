"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useApp } from "@/components/providers/app-provider";
import { useMediaQuery } from "@/lib/stores";
import { cx } from "@/lib/utils";
import { useShortcutLabel } from "./command-button";

export type NavId = "top" | "about" | "projects" | "hackathons" | "contact";

export interface DockLink {
  id: NavId;
  label: string;
  icon: ReactNode;
}

export interface DockSocial {
  name: string;
  url: string;
  icon: ReactNode;
}

// Sections without their own dock icon light up the nearest one.
const PARENT: Record<string, NavId> = {
  top: "top",
  about: "about",
  skills: "about",
  education: "about",
  projects: "projects",
  activity: "projects",
  hackathons: "hackathons",
  contact: "contact",
};

const MAX_SCALE = 1.4;
const RANGE = 130;

function useActiveSection(enabled: boolean): NavId | null {
  const [active, setActive] = useState<NavId | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(PARENT[entry.target.id] ?? null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    Object.keys(PARENT).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

function Item({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-dock-item="" className={cx("group relative flex items-end", className)}>
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 translate-y-1 rounded-lg bg-tooltip px-2.5 py-1 text-xs font-bold whitespace-nowrap text-tooltip-foreground opacity-0 shadow-soft transition-[opacity,transform] duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}

// Each icon grows with --s, which the mouse handler sets. Width and height
// change together so neighbours slide apart the way the macOS dock does.
const itemClass =
  "relative grid size-[calc(44px*var(--s,1))] place-items-center rounded-full border border-border bg-card text-foreground no-underline transition-[width,height,background-color,color] duration-150 ease-out hover:text-primary active:bg-secondary aria-[current=true]:border-blush aria-[current=true]:bg-secondary aria-[current=true]:text-secondary-foreground aria-pressed:border-blush aria-pressed:bg-secondary aria-pressed:text-secondary-foreground";

/** The interactive half of the dock. Icons come in as server-rendered nodes. */
export function DockBar({
  nav,
  socials,
  catIcon,
  searchIcon,
}: {
  nav: DockLink[];
  socials: DockSocial[];
  catIcon: ReactNode;
  searchIcon: ReactNode;
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useActiveSection(onHome);
  const current: NavId | null = onHome
    ? active
    : pathname.startsWith("/projects")
      ? "projects"
      : null;
  const { openCommand, catAvailable, catOn, toggleCat } = useApp();
  const shortcut = useShortcutLabel();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const magnify = finePointer && !reducedMotion;
  const bar = useRef<HTMLDivElement>(null);

  const items = () =>
    bar.current?.querySelectorAll<HTMLElement>("[data-dock-item] > :first-child") ?? [];

  const onMove = (event: MouseEvent) => {
    if (!magnify) return;
    items().forEach((el) => {
      const box = el.getBoundingClientRect();
      const distance = Math.abs(event.clientX - (box.left + box.width / 2));
      const scale = 1 + (MAX_SCALE - 1) * Math.max(0, 1 - distance / RANGE);
      el.style.setProperty("--s", scale.toFixed(3));
    });
  };
  const onLeave = () => items().forEach((el) => el.style.removeProperty("--s"));

  return (
    <nav
      aria-label="Quick navigation"
      className="no-print fixed bottom-3 left-1/2 z-[70] -translate-x-1/2 sm:bottom-4"
    >
      <div
        ref={bar}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="glass glass-strong flex h-[60px] items-end gap-1.5 rounded-[22px] px-2 pb-2 shadow-lift sm:gap-2"
      >
        {nav.map(({ id, label, icon }) => (
          <Item key={id} label={label}>
            <Link
              href={id === "top" ? "/" : `/#${id}`}
              aria-label={label}
              aria-current={current === id ? "true" : undefined}
              className={itemClass}
            >
              {icon}
            </Link>
          </Item>
        ))}

        <span
          aria-hidden="true"
          className="mx-0.5 hidden h-7 w-px self-center bg-border sm:block"
        />

        {socials.map((social) => (
          <Item key={social.name} label={social.name} className="hidden sm:flex">
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.name} (opens in a new tab)`}
              className={itemClass}
            >
              {social.icon}
            </a>
          </Item>
        ))}

        <span
          aria-hidden="true"
          className="mx-0.5 hidden h-7 w-px self-center bg-border sm:block"
        />

        {catAvailable && (
          <Item label="Cursor cat">
            <button
              type="button"
              onClick={toggleCat}
              aria-label="Cursor cat"
              aria-pressed={catOn}
              className={itemClass}
            >
              {catIcon}
            </button>
          </Item>
        )}

        <Item label={`Search ${shortcut}`}>
          <button
            type="button"
            onClick={openCommand}
            aria-label={`Open the command menu (${shortcut})`}
            aria-haspopup="dialog"
            className={itemClass}
          >
            {searchIcon}
          </button>
        </Item>
      </div>
    </nav>
  );
}
