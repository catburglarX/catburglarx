// Adds a hash-based Content-Security-Policy <meta> to every exported page.
// GitHub Pages can't send response headers, so the policy has to live in the
// HTML. Each inline script Next writes (and the theme script) is hashed, so
// script-src never needs 'unsafe-inline'.
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "out");

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

// Inline, executable scripts only: no src, and no data type such as ld+json.
const INLINE_SCRIPT =
  /<script(?![^>]*\bsrc=)(?![^>]*\btype="application\/(?:ld\+)?json")[^>]*>([\s\S]*?)<\/script>/g;

function policy(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.map((h) => `'${h}'`).join(" ")}`,
    // React and next/image write style attributes, which only 'unsafe-inline' allows.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

let pages = 0;
for await (const file of htmlFiles(OUT)) {
  let html = await readFile(file, "utf8");
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;
  const hashes = new Set();
  for (const match of html.matchAll(INLINE_SCRIPT)) {
    const body = match[1] ?? "";
    if (body.trim())
      hashes.add(`sha256-${createHash("sha256").update(body, "utf8").digest("base64")}`);
  }
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy([...hashes])}"/>`;
  // It must come before any script, so it goes straight after <meta charset>.
  html = html.replace(/(<meta charSet="utf-8"\/>)/i, `$1${meta}`);
  if (!html.includes(meta))
    throw new Error(`Could not place the CSP in ${path.relative(OUT, file)}`);
  await writeFile(file, html);
  pages += 1;
}
console.log(`CSP added to ${pages} page(s).`);
