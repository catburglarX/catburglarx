import { Moon, Search, Sun } from "lucide-react";
import { CommandButton } from "./command-button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function TopBar() {
  return (
    <header className="no-print sticky top-3 z-[60] mx-auto mt-3 w-[min(820px,calc(100%-24px))]">
      <div className="glass glass-strong flex items-center justify-between gap-2 rounded-full py-1.5 pr-1.5 pl-3 shadow-soft">
        <Logo />
        <div className="flex items-center gap-2">
          <CommandButton icon={<Search aria-hidden="true" className="size-4" strokeWidth={2} />} />
          <ThemeToggle
            moon={<Moon aria-hidden="true" className="size-[18px]" strokeWidth={2} />}
            sun={<Sun aria-hidden="true" className="size-[18px]" strokeWidth={2} />}
          />
        </div>
      </div>
    </header>
  );
}
