// Measures every text and background pair the site uses, in both themes, and
// fails if any drops under WCAG 2.2 AA. Tokens are read straight from
// globals.css so the numbers can never drift from what ships.
import { readFile } from "node:fs/promises";
import path from "node:path";

const css = await readFile(path.resolve(import.meta.dirname, "../src/app/globals.css"), "utf8");

function block(selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No ${selector} block in globals.css`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]),
  );
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum]. 3 is for large text, focus rings and
// UI boundaries (WCAG 1.4.3 large text and 1.4.11 non-text contrast).
const pairs = [
  ["foreground", "background", 4.5],
  ["foreground", "background-deep", 4.5],
  ["foreground", "card", 4.5],
  ["foreground", "muted", 4.5],
  ["muted-foreground", "background", 4.5],
  ["muted-foreground", "background-deep", 4.5],
  ["muted-foreground", "card", 4.5],
  ["muted-foreground", "muted", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["primary-foreground", "primary-hover", 4.5],
  ["secondary-foreground", "secondary", 4.5],
  ["accent-foreground", "accent-soft", 4.5],
  ["link", "background", 4.5],
  ["link", "background-deep", 4.5],
  ["link", "card", 4.5],
  ["tooltip-foreground", "tooltip", 4.5],
  ["brace", "background", 3],
  ["brace", "card", 3],
  ["ring", "background", 3],
  ["ring", "card", 3],
  ["primary", "background", 3],
  ["shiki-foreground", "shiki-background", 4.5],
  ["shiki-token-keyword", "shiki-background", 4.5],
  ["shiki-token-string", "shiki-background", 4.5],
  ["shiki-token-comment", "shiki-background", 4.5],
  ["shiki-token-constant", "shiki-background", 4.5],
  ["shiki-token-function", "shiki-background", 4.5],
  ["shiki-token-punctuation", "shiki-background", 4.5],
];

let failed = 0;
for (const [theme, selector] of [
  ["light", ":root"],
  ["dark", ".dark"],
]) {
  const tokens = block(selector);
  console.log(`\n${theme}`);
  for (const [fg, bg, min] of pairs) {
    if (!tokens[fg] || !tokens[bg]) {
      console.log(`  MISSING ${fg} or ${bg}`);
      failed += 1;
      continue;
    }
    const value = ratio(tokens[fg], tokens[bg]);
    const ok = value >= min;
    if (!ok) failed += 1;
    console.log(
      `  ${ok ? "pass" : "FAIL"}  ${value.toFixed(2).padStart(5)} : 1  (min ${min})  ${fg} on ${bg}`,
    );
  }
}

if (failed) {
  console.error(`\n${failed} pair(s) below the minimum.`);
  process.exit(1);
}
console.log("\nAll pairs meet WCAG 2.2 AA.");
