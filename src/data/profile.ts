import type { ProfileInput } from "./schema";

// Everything about me that the site shows lives in this one file.
// src/data/validate.ts checks it with Zod on every build, so a typo fails the
// build instead of shipping a broken page. This file stays plain data so Zod
// never reaches the browser. See "Editing the content" in the README.
export const profile = {
  name: "Antra Kumari",
  firstName: "Antra",
  handle: "catburglarX",
  pronouns: "she/her",
  role: "First-year B.Tech CSE student",
  location: "Jaipur, India",
  email: "connect.antra@gmail.com",
  status: "Open to internships and hackathon teams",
  tagline: "coffee and { code }",
  // Keep these about the same length, so the braces around them sit close.
  typedLines: ["coffee and code", "CSE, first year", "learning Python", "building Maanak"],
  bio: "I study computer science at Poornima College of Engineering in Jaipur. I'm in my first year. I know HTML and CSS, and I'm learning Python. I'm looking for an internship and a hackathon team.",
  about: [
    "I started with HTML and CSS. I still like them the most. I care about small things, like how a page looks on a small phone.",
    "My main project is Maanak. It helps officers check packaged goods in India from a photo. If the photo doesn't show something, the app says so. It never guesses.",
    "Now I'm learning Python, one small program at a time. I took part in Smart India Hackathon 2026, and I want to join more hackathons.",
  ],
  aboutCode: {
    pronouns: "she/her",
    studying: "B.Tech CSE, first year",
    knows: ["HTML", "CSS"],
    learning: ["Python"],
    lookingFor: ["internship", "team"],
    fuel: "coffee",
  },
  catLines: ["meow", "hi there", "git push?", "more coffee, please", "purr"],
  skills: [
    {
      group: "Languages",
      items: [
        { name: "HTML", logo: "html.svg" },
        { name: "CSS", logo: "css.svg" },
      ],
    },
    {
      group: "Tools",
      items: [
        { name: "Git", logo: "git.svg" },
        { name: "GitHub", logo: "github.svg" },
      ],
    },
    {
      group: "Currently learning",
      items: [{ name: "Python", logo: "python.svg" }],
    },
  ],
  education: [
    {
      school: "Poornima College of Engineering",
      detail: "B.Tech, Computer Science and Engineering",
      period: "Since 2026",
      current: true,
      logo: "poornima",
    },
    {
      school: "Birla Open Minds International School",
      detail: "Classes 11 and 12",
      logo: "birla-open-minds",
    },
    {
      school: "Banasthali Vidyapith",
      detail: "Classes 6 to 10",
      logo: "banasthali",
    },
  ],
  events: [
    {
      title: "Smart India Hackathon",
      when: "2026",
      description: "I took part in SIH 2026. It is India's national hackathon for students.",
      logo: "sih",
      url: "https://sih.gov.in/",
    },
  ],
  lookingForTeam:
    "I want to join a team for my next hackathon. I can build web pages, and I'm getting better at Python.",
  socials: [
    { name: "GitHub", handle: "catburglarX", url: "https://github.com/catburglarX" },
    { name: "LinkedIn", handle: "antra2703", url: "https://www.linkedin.com/in/antra2703" },
    { name: "Instagram", handle: "catburglarX", url: "https://www.instagram.com/catburglarX" },
    { name: "X", handle: "catburglarX", url: "https://x.com/catburglarX" },
  ],
  resumePdf: "/antra-kumari-resume.pdf",
} satisfies ProfileInput;
