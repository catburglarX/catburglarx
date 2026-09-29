import { FileText, FolderGit2, Mail } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { AvatarButton } from "./avatar-button";
import { Typer } from "./typer";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="top-title"
      className="grid items-center gap-8 pt-10 pb-4 text-center sm:grid-cols-[1fr_auto] sm:gap-10 sm:pt-16 sm:text-left"
    >
      <div className="order-2 sm:order-1">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-extrabold text-accent-foreground">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-[pulse-ring_2s_ease-out_infinite]" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          {profile.status}
        </p>
        <h1
          id="top-title"
          tabIndex={-1}
          className="mt-4 text-[2.5rem] leading-[1.05] outline-none sm:text-6xl"
        >
          Hi, I&apos;m {profile.name}
        </h1>
        <div className="mt-3">
          <Typer lines={profile.typedLines} />
        </div>
        <p className="mt-1 font-bold text-muted-foreground">
          @{profile.handle} · {profile.pronouns} · {profile.location}
        </p>
        <p className="mx-auto mt-4 max-w-[52ch] text-[1.0625rem] sm:mx-0">{profile.bio}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
          <Link href="/#projects" className={`${buttonStyles.primary} w-full sm:w-auto`}>
            <FolderGit2 aria-hidden="true" className="size-4" strokeWidth={2.25} />
            Projects
          </Link>
          <Link href="/resume/" className={`${buttonStyles.ghost} flex-1 sm:flex-none`}>
            <FileText aria-hidden="true" className="size-4" strokeWidth={2.25} />
            Resume
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className={`${buttonStyles.ghost} flex-1 sm:flex-none`}
          >
            <Mail aria-hidden="true" className="size-4" strokeWidth={2.25} />
            Email
          </a>
        </div>
      </div>
      <div className="order-1 pt-2 sm:order-2">
        <AvatarButton lines={profile.catLines} />
      </div>
    </section>
  );
}
