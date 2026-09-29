"use client";

import {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Social } from "@/data/schema";
import { RevealObserver } from "./reveal-observer";
import {
  currentTheme,
  prefersReducedMotion,
  readStorage,
  setCatPreference,
  setTheme,
  useCatPreference,
  useMediaQuery,
  useTheme,
  type Theme,
} from "@/lib/stores";

export interface ContactInfo {
  email: string;
  socials: Social[];
}

export interface CommandProject {
  slug: string;
  title: string;
  tags: string[];
}

interface AppContextValue extends ContactInfo {
  theme: Theme | null;
  toggleTheme: () => void;
  openCommand: () => void;
  catAvailable: boolean;
  catOn: boolean;
  toggleCat: () => void;
  notify: (message: string) => void;
  copyEmail: () => Promise<void>;
  rainHearts: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside <AppProvider>");
  return value;
}

// Everything below loads after the page is interactive, so none of it
// counts towards the first-load JavaScript of any page.
// They only render after a client-side state change, so React.lazy is enough
// and none of them is ever rendered on the server.
const CommandMenu = lazy(() => import("@/components/features/command-menu"));
const CursorCat = lazy(() => import("@/components/features/cursor-cat"));
const HeartBurst = lazy(() => import("@/components/features/heart-burst"));
const Toaster = lazy(() => import("@/components/features/toaster"));

function onIdle(callback: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 1200);
  return () => clearTimeout(id);
}

// Contact details arrive as props from the server layout, so the full profile
// (bio, about text and so on) never ships in the client bundle.
export function AppProvider({
  contact,
  projects,
  children,
}: {
  contact: ContactInfo;
  projects: CommandProject[];
  children: ReactNode;
}) {
  const { email, socials } = contact;
  const theme = useTheme();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const catWanted = useCatPreference();
  const catAvailable = finePointer && !reducedMotion;
  const catOn = catAvailable && catWanted;

  const [commandOpen, setCommandOpen] = useState(false);
  const [commandLoaded, setCommandLoaded] = useState(false);
  const [extrasReady, setExtrasReady] = useState(false);
  const pendingToasts = useRef<string[]>([]);
  const opener = useRef<HTMLElement | null>(null);
  const rememberOpener = () => {
    if (document.activeElement instanceof HTMLElement) opener.current = document.activeElement;
  };
  const toastRef = useRef<((message: string) => void) | null>(null);

  useEffect(() => {
    // Follow the system setting until the visitor picks a theme themselves.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (!readStorage("theme")) setTheme(event.matches ? "dark" : "light", false);
    };
    media.addEventListener("change", onSystemChange);
    const cancelIdle = onIdle(() => setExtrasReady(true));
    return () => {
      media.removeEventListener("change", onSystemChange);
      cancelIdle();
    };
  }, []);

  const openCommand = useCallback(() => {
    rememberOpener();
    setCommandLoaded(true);
    setCommandOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!document.querySelector("[role=dialog]")) rememberOpener();
        setCommandLoaded(true);
        setCommandOpen((open) => !open);
        return;
      }
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? "");
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        openCommand();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCommand]);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme() === "dark" ? "light" : "dark", true);
  }, []);

  const notify = useCallback((message: string) => {
    if (toastRef.current) {
      toastRef.current(message);
      return;
    }
    pendingToasts.current.push(message);
    setExtrasReady(true);
  }, []);

  const onToasterReady = useCallback((toast: (message: string) => void) => {
    toastRef.current = toast;
    pendingToasts.current.splice(0).forEach(toast);
  }, []);

  const toggleCat = useCallback(() => {
    setCatPreference(!catOn);
    notify(catOn ? "The cursor cat is taking a nap." : "The cursor cat is awake.");
  }, [catOn, notify]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      notify(`Copied ${email}`);
    } catch {
      notify(`Couldn't copy it. My email is ${email}`);
    }
  }, [email, notify]);

  const rainHearts = useCallback(() => {
    if (prefersReducedMotion()) {
      notify("Sending you a heart, minus the animation.");
      return;
    }
    void import("@/components/features/heart-rain").then((m) => m.rainHearts());
  }, [notify]);

  const value = useMemo<AppContextValue>(
    () => ({
      email,
      socials,
      theme,
      toggleTheme,
      openCommand,
      catAvailable,
      catOn,
      toggleCat,
      notify,
      copyEmail,
      rainHearts,
    }),
    [
      email,
      socials,
      theme,
      toggleTheme,
      openCommand,
      catAvailable,
      catOn,
      toggleCat,
      notify,
      copyEmail,
      rainHearts,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <RevealObserver />
      {/* One boundary each, so loading one never hides another. */}
      <Suspense fallback={null}>
        {commandLoaded && (
          <CommandMenu
            open={commandOpen}
            onOpenChange={setCommandOpen}
            projects={projects}
            returnFocus={opener}
          />
        )}
      </Suspense>
      <Suspense fallback={null}>{extrasReady && <Toaster onReady={onToasterReady} />}</Suspense>
      <Suspense fallback={null}>{extrasReady && catAvailable && <HeartBurst />}</Suspense>
      <Suspense fallback={null}>{catOn && <CursorCat />}</Suspense>
    </AppContext.Provider>
  );
}
