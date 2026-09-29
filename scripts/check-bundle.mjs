// Fails when the home page's first-load JavaScript goes over budget.
// It adds up every script the exported HTML loads before interaction,
// gzipped the way GitHub Pages serves them. Lazy chunks are not counted.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 150;
const OUT = path.resolve(import.meta.dirname, "..", "out");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/catburglarx";

const pages = [
  "index.html",
  "projects/index.html",
  "projects/maanak/index.html",
  "resume/index.html",
];
let failed = false;

for (const page of pages) {
  const html = await readFile(path.join(OUT, page), "utf8");
  // noModule polyfills are skipped by every browser the site supports.
  const tags = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*>/g)].filter(
    (m) => !/noModule/i.test(m[0]),
  );
  const srcs = [...new Set(tags.map((m) => m[1]))];
  let total = 0;
  for (const src of srcs) {
    const file = path.join(OUT, src.replace(BASE, "").replace(/^\//, ""));
    total += gzipSync(await readFile(file), { level: 9 }).length;
  }
  const inline = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1] ?? "")
    .join("");
  const inlineKb = gzipSync(inline).length / 1024;
  const kb = total / 1024;
  const over = kb > BUDGET_KB;
  if (over) failed = true;
  console.log(
    `${over ? "OVER" : "ok  "}  ${kb.toFixed(1).padStart(6)} KB gzipped JS in ${String(srcs.length).padStart(2)} files  (+${inlineKb.toFixed(1)} KB inline data)  ${page}`,
  );
}

if (failed) {
  console.error(`\nFirst-load JavaScript is over the ${BUDGET_KB} KB budget.`);
  process.exit(1);
}
console.log(`\nEvery page is under the ${BUDGET_KB} KB budget.`);
