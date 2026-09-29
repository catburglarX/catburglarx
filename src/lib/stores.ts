"use client";

import { useSyncExternalStore } from "react";

// Small external stores for browser state. Reading them through
// useSyncExternalStore keeps server HTML and the first client render in step.

export type Theme = "light" | "dark";

const THEME_EVENT = "themechange";
const CAT_EVENT = "cursorcatchange";
const CAT_KEY = "cursor-cat";
const THEME_COLORS: Record<Theme, string> = { light: "#fff8ee", dark: "#1b1418" };

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private browsing can block storage. The choice then lasts for this visit only.
  }
}

function subscribeEvent(name: string) {
  return (callback: () => void) => {
    window.addEventListener(name, callback);
    return () => window.removeEventListener(name, callback);
  };
}

export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(theme: Theme, remember: boolean) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", THEME_COLORS[theme]));
  if (remember) writeStorage("theme", theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

const subscribeTheme = subscribeEvent(THEME_EVENT);

export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribeTheme, currentTheme, () => null);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const subscribeCat = subscribeEvent(CAT_EVENT);

export function useCatPreference(): boolean {
  return useSyncExternalStore(
    subscribeCat,
    () => readStorage(CAT_KEY) !== "off",
    () => false,
  );
}

export function setCatPreference(on: boolean) {
  writeStorage(CAT_KEY, on ? "on" : "off");
  window.dispatchEvent(new Event(CAT_EVENT));
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
