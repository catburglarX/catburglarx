import { Home } from "lucide-react";
import Link from "next/link";
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
        The link might be old, or the address has a typo. The cat is fine, it&apos;s just napping on
        the page you wanted.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonStyles.primary}>
          <Home aria-hidden="true" className="size-4" strokeWidth={2.25} />
          Go home
        </Link>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        Or press{" "}
        <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 text-xs font-bold text-foreground">
          Ctrl K
        </kbd>{" "}
        (
        <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 text-xs font-bold text-foreground">
          ⌘K
        </kbd>{" "}
        on a Mac) to search the site.
      </p>
    </main>
  );
}
