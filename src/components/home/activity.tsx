import { ExternalLink } from "lucide-react";
import { CatSleeping } from "@/components/mascot/cat";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/profile";
import { getContributions, type Contributions } from "@/lib/github";
import { ScrollToEnd } from "./scroll-to-end";

const HEAT = ["var(--heat-0)", "var(--heat-1)", "var(--heat-2)", "var(--heat-3)", "var(--heat-4)"];
const githubUrl = `https://github.com/${profile.handle}`;

function monthLabels(weeks: Contributions["weeks"]) {
  const labels: Array<{ column: number; text: string }> = [];
  let last = -1;
  weeks.forEach((week, column) => {
    const first = week[0];
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== last) {
      // Skip a label that would crowd the one before it.
      const previous = labels[labels.length - 1];
      if (!previous || column - previous.column >= 3) {
        labels.push({
          column,
          text: new Date(`${first.date}T00:00:00Z`).toLocaleDateString("en-GB", {
            month: "short",
            timeZone: "UTC",
          }),
        });
      }
      last = month;
    }
  });
  return labels;
}

function plural(n: number, word: string) {
  return `${n.toLocaleString("en-GB")} ${word}${n === 1 ? "" : "s"}`;
}

function Calendar({ data }: { data: Contributions }) {
  const labels = monthLabels(data.weeks);
  const columns = `repeat(${data.weeks.length}, 11px)`;
  return (
    <>
      <dl className="mb-4 grid grid-cols-3 gap-3 text-center sm:text-left">
        {[
          ["in the last year", plural(data.total, "contribution")],
          ["current streak", plural(data.currentStreak, "day")],
          ["longest streak", plural(data.longestStreak, "day")],
        ].map(([label, value]) => (
          <div key={label} className="rounded-control bg-muted px-3 py-2.5">
            <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
            <dd className="font-heading text-lg font-semibold sm:text-xl">{value}</dd>
          </div>
        ))}
      </dl>
      <ScrollToEnd label="Contribution calendar, scrollable">
        <div className="w-max" aria-hidden="true">
          <div
            className="mb-1.5 grid gap-[3px] text-xs font-bold text-muted-foreground"
            style={{ gridTemplateColumns: columns }}
          >
            {labels.map((l) => (
              <span key={l.column} style={{ gridColumn: `${l.column + 1} / span 3` }}>
                {l.text}
              </span>
            ))}
          </div>
          <div
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
            style={{ gridTemplateColumns: columns }}
          >
            {data.weeks.map((week) =>
              week.map((day) => (
                <span
                  key={day.date}
                  title={`${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`}
                  className="size-[11px] rounded-[3px]"
                  // The first and last weeks can be partial, so each day sits on its weekday row.
                  style={{
                    backgroundColor: HEAT[day.level],
                    gridRow: new Date(`${day.date}T00:00:00Z`).getUTCDay() + 1,
                  }}
                />
              )),
            )}
          </div>
        </div>
      </ScrollToEnd>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link inline-flex min-h-11 items-center gap-1 text-sm"
        >
          @{profile.handle} on GitHub
          <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <span aria-hidden="true" className="flex items-center gap-1">
          less
          {HEAT.map((c) => (
            <span key={c} className="size-[11px] rounded-[3px]" style={{ backgroundColor: c }} />
          ))}
          more
        </span>
      </div>
    </>
  );
}

function Fallback() {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <CatSleeping className="w-32" />
      <p className="max-w-[40ch] text-muted-foreground">
        The contribution calendar didn&apos;t load when this page was built. It&apos;s still on
        GitHub.
      </p>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="link inline-flex min-h-11 items-center gap-1"
      >
        See @{profile.handle} on GitHub
        <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}

export async function Activity() {
  const data = await getContributions(profile.handle);
  return (
    <section id="activity" aria-labelledby="activity-title" className="pt-16">
      <SectionHeading
        id="activity"
        title="activity"
        intro="My real GitHub contribution calendar. It updates once a day."
      />
      <BlurFade className="card p-5 sm:p-6">
        {data ? <Calendar data={data} /> : <Fallback />}
      </BlurFade>
    </section>
  );
}
