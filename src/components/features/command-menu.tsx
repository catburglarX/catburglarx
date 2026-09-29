"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import {
  BookOpen,
  Cat,
  Copy,
  FileText,
  FolderGit2,
  GraduationCap,
  Heart,
  Home,
  Mail,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trophy,
  User,
  Activity,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode, RefObject } from "react";
import { SocialIcon } from "@/components/ui/social-icon";
import { useApp, type CommandProject } from "@/components/providers/app-provider";
import { SECTIONS, type SectionId } from "@/lib/site";

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  top: Home,
  about: User,
  skills: Wrench,
  education: GraduationCap,
  projects: FolderGit2,
  activity: Activity,
  hackathons: Trophy,
  contact: Mail,
};

const SECTION_KEYWORDS: Partial<Record<SectionId, string[]>> = {
  top: ["start", "hero", "intro"],
  about: ["bio", "who"],
  skills: ["html", "css", "python", "languages", "tools"],
  education: ["college", "school", "poornima", "btech"],
  projects: ["work", "built", "maanak"],
  activity: ["commits", "contributions", "calendar", "streak"],
  hackathons: ["sih", "events", "team"],
  contact: ["email", "hire", "message", "internship"],
};

function Row({ icon, children, hint }: { icon: ReactNode; children: ReactNode; hint?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="grid size-8 flex-none place-items-center rounded-control border border-border bg-card text-muted-foreground"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint && (
        <span className="ml-auto hidden max-w-[45%] truncate font-mono text-xs text-muted-foreground sm:block">
          {hint}
        </span>
      )}
    </>
  );
}

const itemClass =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-control px-2.5 py-1.5 text-[0.9375rem] font-bold text-foreground select-none data-[selected=true]:bg-secondary data-[selected=true]:text-secondary-foreground";
const groupClass =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-muted-foreground";

export default function CommandMenu({
  open,
  onOpenChange,
  projects,
  returnFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: CommandProject[];
  /** Whatever had focus before the menu opened. The provider records it, since this mounts lazily. */
  returnFocus: RefObject<HTMLElement | null>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    email,
    socials,
    theme,
    toggleTheme,
    catAvailable,
    catOn,
    toggleCat,
    copyEmail,
    rainHearts,
  } = useApp();

  // Close first, then act, so focus has returned before the page scrolls or changes.
  const run = (action: () => void) => {
    onOpenChange(false);
    requestAnimationFrame(action);
  };

  const goToSection = (id: SectionId) => {
    if (pathname === "/") {
      const target = id === "top" ? document.body : document.getElementById(id);
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (id === "top") window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      else target?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      history.replaceState(null, "", id === "top" ? "./" : `#${id}`);
      const heading = document.getElementById(`${id}-title`);
      heading?.focus({ preventScroll: true });
    } else {
      router.push(id === "top" ? "/" : `/#${id}`);
    }
  };

  const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-[#3b2a36]/25 backdrop-blur-[6px] data-[state=open]:animate-[fade_150ms_ease-out]" />
        <Dialog.Content
          className="fixed top-[12vh] left-1/2 z-[101] w-[min(560px,calc(100%-24px))] -translate-x-1/2 outline-none"
          aria-describedby="command-help"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (returnFocus.current?.isConnected) returnFocus.current.focus();
          }}
        >
          {/* Motion lives here, in a chunk that only loads when the menu first opens. */}
          <LazyMotion features={domAnimation} strict>
            <MotionConfig reducedMotion="user">
              <m.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="glass glass-strong overflow-hidden rounded-card shadow-lift"
              >
                <Dialog.Title className="sr-only">Command menu</Dialog.Title>
                <p id="command-help" className="sr-only">
                  Type to filter. Use the arrow keys to move, Enter to choose and Escape to close.
                </p>
                <Command label="Commands" loop className="flex flex-col">
                  <div className="flex items-center gap-3 border-b border-border px-4">
                    <Search
                      aria-hidden="true"
                      className="size-4.5 flex-none text-muted-foreground"
                      strokeWidth={2}
                    />
                    <Command.Input
                      placeholder="Search sections, projects and actions"
                      className="h-14 min-w-0 flex-1 bg-transparent text-base font-bold text-foreground outline-none placeholder:font-semibold placeholder:text-muted-foreground"
                    />
                    <kbd className="hidden rounded-md border border-border bg-card px-1.5 py-0.5 text-xs font-bold text-muted-foreground sm:block">
                      Esc
                    </kbd>
                  </div>
                  <Command.List className="max-h-[min(56vh,420px)] overflow-y-auto overscroll-contain p-2">
                    <Command.Empty className="px-3 py-10 text-center font-bold text-muted-foreground">
                      Nothing matches that. The cat looked everywhere.
                    </Command.Empty>

                    <Command.Group heading="Go to" className={groupClass}>
                      {SECTIONS.map(({ id, label }) => {
                        const Icon = SECTION_ICONS[id];
                        return (
                          <Command.Item
                            key={id}
                            value={`section ${label}`}
                            keywords={SECTION_KEYWORDS[id]}
                            onSelect={() => run(() => goToSection(id))}
                            className={itemClass}
                          >
                            <Row icon={<Icon className="size-4" strokeWidth={2} />}>{label}</Row>
                          </Command.Item>
                        );
                      })}
                      <Command.Item
                        value="page all projects"
                        keywords={["work", "list", "filter"]}
                        onSelect={() => run(() => router.push("/projects/"))}
                        className={itemClass}
                      >
                        <Row icon={<BookOpen className="size-4" strokeWidth={2} />}>
                          All projects
                        </Row>
                      </Command.Item>
                      <Command.Item
                        value="page resume"
                        keywords={["cv", "pdf"]}
                        onSelect={() => run(() => router.push("/resume/"))}
                        className={itemClass}
                      >
                        <Row icon={<FileText className="size-4" strokeWidth={2} />}>Resume</Row>
                      </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Projects" className={groupClass}>
                      {projects.map((project) => (
                        <Command.Item
                          key={project.slug}
                          value={`project ${project.title}`}
                          keywords={project.tags}
                          onSelect={() => run(() => router.push(`/projects/${project.slug}/`))}
                          className={itemClass}
                        >
                          <Row
                            icon={<FolderGit2 className="size-4" strokeWidth={2} />}
                            hint={project.tags.join(", ")}
                          >
                            {project.title}
                          </Row>
                        </Command.Item>
                      ))}
                    </Command.Group>

                    <Command.Group heading="Actions" className={groupClass}>
                      <Command.Item
                        value="action copy email"
                        keywords={["mail", "contact"]}
                        onSelect={() => run(() => void copyEmail())}
                        className={itemClass}
                      >
                        <Row icon={<Copy className="size-4" strokeWidth={2} />} hint={email}>
                          Copy my email
                        </Row>
                      </Command.Item>
                      <Command.Item
                        value="action switch theme"
                        keywords={["dark", "light", "mode", "night"]}
                        onSelect={() => run(toggleTheme)}
                        className={itemClass}
                      >
                        <Row
                          icon={
                            theme === "dark" ? (
                              <Sun className="size-4" strokeWidth={2} />
                            ) : (
                              <Moon className="size-4" strokeWidth={2} />
                            )
                          }
                        >
                          {theme === "dark"
                            ? "Switch to the light theme"
                            : "Switch to the dark theme"}
                        </Row>
                      </Command.Item>
                      {catAvailable && (
                        <Command.Item
                          value="action cursor cat"
                          keywords={["cat", "neko", "pet", "mouse"]}
                          onSelect={() => run(toggleCat)}
                          className={itemClass}
                        >
                          <Row icon={<Cat className="size-4" strokeWidth={2} />}>
                            {catOn ? "Turn the cursor cat off" : "Turn the cursor cat on"}
                          </Row>
                        </Command.Item>
                      )}
                      <Command.Item
                        value="action rain hearts"
                        keywords={["love", "fun", "surprise", "easter egg"]}
                        onSelect={() => run(rainHearts)}
                        className={itemClass}
                      >
                        <Row icon={<Heart className="size-4" strokeWidth={2} />}>Rain hearts</Row>
                      </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Profiles" className={groupClass}>
                      {socials.map((social) => (
                        <Command.Item
                          key={social.name}
                          value={`profile ${social.name}`}
                          keywords={["social", social.handle]}
                          onSelect={() => run(() => openExternal(social.url))}
                          className={itemClass}
                        >
                          <Row
                            icon={<SocialIcon name={social.name} className="size-4" />}
                            hint={`@${social.handle}`}
                          >
                            {social.name}
                          </Row>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  </Command.List>
                  <div
                    aria-hidden="true"
                    className="hidden items-center justify-end gap-4 border-t border-border px-4 py-2.5 text-xs font-bold text-muted-foreground pointer-fine:flex"
                  >
                    <span className="mr-auto inline-flex items-center gap-1.5">
                      <Sparkles className="size-3.5" strokeWidth={2} /> type / to open
                    </span>
                    <span>↑ ↓ move</span>
                    <span>↵ choose</span>
                    <span>esc close</span>
                  </div>
                </Command>
              </m.div>
            </MotionConfig>
          </LazyMotion>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
