import { z } from "zod";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
  total: number;
  currentStreak: number;
  longestStreak: number;
  weeks: ContributionDay[][];
  fetchedAt: string;
}

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

const responseSchema = z.object({
  data: z.object({
    user: z.object({
      contributionsCollection: z.object({
        contributionCalendar: z.object({
          totalContributions: z.number(),
          weeks: z.array(
            z.object({
              contributionDays: z.array(
                z.object({
                  date: z.string(),
                  contributionCount: z.number(),
                  contributionLevel: z.enum([
                    "NONE",
                    "FIRST_QUARTILE",
                    "SECOND_QUARTILE",
                    "THIRD_QUARTILE",
                    "FOURTH_QUARTILE",
                  ]),
                }),
              ),
            }),
          ),
        }),
      }),
    }),
  }),
});

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

/** Streaks over days in date order. A zero today doesn't break the current streak yet. */
export function streaks(days: ContributionDay[]): { current: number; longest: number } {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    const day = days[i];
    if (!day) break;
    if (day.count > 0) current += 1;
    else if (i === days.length - 1) continue;
    else break;
  }
  return { current, longest };
}

/**
 * Fetches the last year of the contribution calendar at build time.
 * Returns null when there is no token or GitHub fails, and the section shows a fallback.
 */
export async function getContributions(login: string): Promise<Contributions | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "antra-portfolio-build",
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      cache: "force-cache",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const parsed = responseSchema.safeParse(await res.json());
    if (!parsed.success) return null;
    const calendar = parsed.data.data.user.contributionsCollection.contributionCalendar;
    const weeks = calendar.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVELS[d.contributionLevel],
      })),
    );
    const { current, longest } = streaks(weeks.flat());
    return {
      total: calendar.totalContributions,
      currentStreak: current,
      longestStreak: longest,
      weeks,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
