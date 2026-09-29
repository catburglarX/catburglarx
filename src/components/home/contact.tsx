import { Copy, Mail } from "lucide-react";
import { CatSitting } from "@/components/mascot/cat";
import { BlurFade } from "@/components/ui/blur-fade";
import { Braces } from "@/components/ui/section-heading";
import { SocialIcon } from "@/components/ui/social-icon";
import { buttonStyles } from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { CopyEmailButton } from "./copy-email-button";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="pt-24">
      <BlurFade className="glass glass-strong relative rounded-card px-5 pt-12 pb-9 text-center shadow-soft sm:px-10">
        <CatSitting blink className="absolute -top-[74px] right-6 w-[72px] sm:right-12" />
        <h2 id="contact-title" tabIndex={-1} className="text-[1.75rem] outline-none sm:text-4xl">
          <Braces>contact</Braces>
        </h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-muted-foreground">
          Have an internship or a hackathon team for me? Send me an email. You can also find me as @
          {profile.handle} on all of these.
        </p>
        <p className="mt-2 font-mono text-sm font-bold break-all">{profile.email}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${profile.email}`} className={buttonStyles.primary}>
            <Mail aria-hidden="true" className="size-4" strokeWidth={2.25} />
            Email me
          </a>
          <CopyEmailButton
            icon={<Copy aria-hidden="true" className="size-4" strokeWidth={2.25} />}
          />
        </div>
        <ul className="mt-7 flex flex-wrap justify-center gap-2" aria-label="Profiles">
          {profile.socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-bold text-foreground no-underline transition-colors hover:border-blush hover:text-primary"
              >
                <SocialIcon name={social.name} className="size-4" />
                {social.name}
                <span className="sr-only">: @{social.handle} (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </BlurFade>
    </section>
  );
}
