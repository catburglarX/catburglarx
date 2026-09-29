import { Home, Search } from "lucide-react";
import Link from "next/link";
import { SearchButton } from "@/components/layout/search-button";
import { ShortcutKey } from "@/components/layout/shortcut-key";
import { CatSleeping } from "@/components/mascot/cat";
import { buttonStyles } from "@/components/ui/styles";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto flex w-[min(640px,calc(100%-40px))] flex-col items-center pt-16 text-center outline-none"
    >
      <div className="relative">
        <CatSleeping className="w-56 sm:w-64" />
        <span
          aria-hidden="true"
          className="absolute -top-2 right-6 font-heading text-lg font-semibold text-primary motion-safe:animate-[zzz_2.2s_ease-in-out_infinite]"
        >
          z z z
        </span>
      </div>
      <p className="mt-6 font-mono text-sm font-bold text-muted-foreground">404</p>
      <h1 className="mt-1 text-4xl sm:text-5xl">This page is asleep</h1>
      <p className="mt-3 max-w-[44ch] text-muted-foreground">
        This link may be old, or the address has a typo. The cat is just sleeping on it.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonStyles.primary}>
          <Home aria-hidden="true" className="size-4" strokeWidth={2.25} />
          Go home
        </Link>
        <SearchButton icon={<Search aria-hidden="true" className="size-4" strokeWidth={2.25} />}>
          Search the site
        </SearchButton>
      </div>
      <p className="mt-5 hidden text-sm text-muted-foreground pointer-fine:block">
        You can also press <ShortcutKey /> to search.
      </p>
    </main>
  );
}
