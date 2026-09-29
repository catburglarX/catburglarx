import Link from "next/link";
import { profile } from "@/data/profile";
import { SocialIcon } from "@/components/ui/social-icon";

export function Footer() {
  return (
    <footer className="no-print mx-auto w-[min(760px,calc(100%-40px))] pt-16 pb-36 text-center text-sm text-muted-foreground">
      <ul className="mb-4 flex justify-center gap-2" aria-label="Profiles">
        {profile.socials.map((social) => (
          <li key={social.name}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-primary"
            >
              <SocialIcon name={social.name} className="size-[18px]" />
              <span className="sr-only">{social.name} (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <p>
        Made by {profile.name} with coffee and{" "}
        <code className="rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-xs text-foreground">
          {"{ code }"}
        </code>
        . © {new Date().getFullYear()}
      </p>
      <p className="mt-1">
        <Link href="/resume/" className="link">
          Résumé
        </Link>
        <span aria-hidden="true"> · </span>
        <a
          href="https://github.com/catburglarX/catburglarx"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
        </a>
      </p>
    </footer>
  );
}
