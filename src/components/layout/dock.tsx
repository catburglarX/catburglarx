import { Cat, FolderGit2, Home, Mail, Search, Trophy, User } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icon";
import { profile } from "@/data/profile";
import { DockBar, type DockLink } from "./dock-bar";

const icon = "size-[42%]";

const NAV: DockLink[] = [
  { id: "top", label: "Home", icon: <Home aria-hidden="true" className={icon} strokeWidth={2} /> },
  {
    id: "about",
    label: "About",
    icon: <User aria-hidden="true" className={icon} strokeWidth={2} />,
  },
  {
    id: "projects",
    label: "Projects",
    icon: <FolderGit2 aria-hidden="true" className={icon} strokeWidth={2} />,
  },
  {
    id: "hackathons",
    label: "Hackathons",
    icon: <Trophy aria-hidden="true" className={icon} strokeWidth={2} />,
  },
  {
    id: "contact",
    label: "Contact",
    icon: <Mail aria-hidden="true" className={icon} strokeWidth={2} />,
  },
];

/** Bottom dock. The icons render here on the server, so they cost no JavaScript. */
export function Dock() {
  const socials = profile.socials
    .filter((s) => s.name === "GitHub" || s.name === "LinkedIn")
    .map((s) => ({
      name: s.name,
      url: s.url,
      icon: <SocialIcon name={s.name} className="size-[40%]" />,
    }));
  return (
    <DockBar
      nav={NAV}
      socials={socials}
      catIcon={<Cat aria-hidden="true" className={icon} strokeWidth={2} />}
      searchIcon={<Search aria-hidden="true" className={icon} strokeWidth={2} />}
    />
  );
}
