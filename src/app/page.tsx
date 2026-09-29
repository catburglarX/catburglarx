import { About } from "@/components/home/about";
import { Activity } from "@/components/home/activity";
import { Contact } from "@/components/home/contact";
import { Education } from "@/components/home/education";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hackathons } from "@/components/home/hackathons";
import { Hero } from "@/components/home/hero";
import { Skills } from "@/components/home/skills";
import { profile } from "@/data/profile";
import { absoluteUrl } from "@/lib/site";

function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.handle,
    url: absoluteUrl("/"),
    image: absoluteUrl("/avatar.png"),
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: profile.bio,
    address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressCountry: "IN" },
    affiliation: { "@type": "CollegeOrUniversity", name: "Poornima College of Engineering" },
    alumniOf: profile.education
      .filter((e) => !e.current)
      .map((e) => ({ "@type": "EducationalOrganization", name: e.school })),
    knowsAbout: profile.skills.flatMap((g) => g.items.map((s) => s.name)),
    sameAs: profile.socials.map((s) => s.url),
  };
}

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-[min(820px,calc(100%-40px))] outline-none">
      <script
        type="application/ld+json"
        // JSON.stringify output with < escaped, so the data can never close the tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <About />
      <Skills />
      <Education />
      <FeaturedProjects />
      <Activity />
      <Hackathons />
      <Contact />
    </main>
  );
}
