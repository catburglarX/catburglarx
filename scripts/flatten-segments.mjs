// Next 16 writes per-segment prefetch files as nested folders, for example
// out/resume/__next.resume/__PAGE__.txt, but the client router asks for the
// flat name out/resume/__next.resume.__PAGE__.txt. A server with rewrites
// hides this; GitHub Pages has none, so every prefetch would 404. This copies
// each nested file to the flat name the router requests.
import { copyFile, readdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "out");
let copied = 0;

async function flatten(segmentDir, parent, prefix) {
  for (const entry of await readdir(segmentDir, { withFileTypes: true })) {
    const name = `${prefix}.${entry.name}`;
    const full = path.join(segmentDir, entry.name);
    if (entry.isDirectory()) await flatten(full, parent, name);
    else {
      await copyFile(full, path.join(parent, name));
      copied += 1;
    }
  }
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) await flatten(full, dir, entry.name);
    else await walk(full);
  }
}

await walk(OUT);
console.log(`Flattened ${copied} prefetch file(s).`);
