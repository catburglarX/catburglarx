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
  email: "connect.antrakumari@gmail.com",
  status: "Open to internships and hackathon teams",
  tagline: "coffee and { code }",
  typedLines: ["coffee and code", "B.Tech CSE, first year", "learning Python", "building Maanak"],
  bio: "I'm a first-year computer science student at Poornima College of Engineering in Jaipur. I write HTML and CSS, I'm learning Python, and my main project is Maanak. I'm looking for an internship and a team for the next hackathon.",
  about: [
    "I started with HTML and CSS, and those are still the two I'm most comfortable with. This site is built on them, with a lot of care spent on how it reads on a small phone.",
    "Maanak is the project I've spent the most time on. It records inspections of packaged goods in India. Its main rule is simple: if the photo doesn't show something, the app says it can't tell. It never turns missing evidence into a violation.",
    "Right now I'm learning Python properly, one small program at a time. I took part in Smart India Hackathon 2026 and I want to do more hackathons, so if your team needs someone, write to me.",
  ],
  aboutCode: {
    pronouns: "she/her",
    studying: "B.Tech CSE, first year",
    knows: ["HTML", "CSS"],
    learning: ["Python"],
    lookingFor: ["internship", "team"],
    fuel: "coffee",
  },
  catLines: ["meow", "hi, I'm Antra's cat", "git push?", "more coffee, please", "purr"],
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
      period: "2026 to now",
      current: true,
      logo: "poornima",
    },
    {
      school: "Birla Open Minds International School",
      detail: "Classes 11 and 12",
      period: "Senior school",
      logo: "birla-open-minds",
    },
    {
      school: "Banasthali Vidyapith",
      detail: "Classes 6 to 10",
      period: "Middle and high school",
      logo: "banasthali",
    },
  ],
  events: [
    {
      title: "Smart India Hackathon 2026",
      when: "2026",
      description: "I took part in SIH 2026, India's national hackathon for students.",
      logo: "sih",
      url: "https://sih.gov.in/",
    },
  ],
  lookingForTeam:
    "I'm looking for a team for my next hackathon. I can build the front end and I'm getting better at Python.",
  socials: [
    { name: "GitHub", handle: "catburglarX", url: "https://github.com/catburglarX" },
    { name: "LinkedIn", handle: "catburglarX", url: "https://www.linkedin.com/in/catburglarX" },
    { name: "Instagram", handle: "catburglarX", url: "https://www.instagram.com/catburglarX" },
    { name: "X", handle: "catburglarX", url: "https://x.com/catburglarX" },
  ],
  resumePdf: "/antra-kumari-resume.pdf",
} satisfies ProfileInput;
