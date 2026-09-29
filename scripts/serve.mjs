// Serves the static export under the GitHub Pages base path, the way Pages
// does: directory URLs map to index.html, and unknown paths get 404.html.
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "out");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/catburglarx";
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

async function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const file = path.join(OUT, clean);
  if (!file.startsWith(OUT)) return null;
  try {
    const info = await stat(file);
    if (info.isFile()) return file;
    const index = path.join(file, "index.html");
    if ((await stat(index)).isFile()) return index;
  } catch {
    // Fall through to 404.
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/" && BASE) {
    res.writeHead(302, { Location: `${BASE}/` }).end();
    return;
  }
  if (BASE && !url.pathname.startsWith(`${BASE}/`) && url.pathname !== BASE) {
    res.writeHead(404).end("Not under the base path");
    return;
  }
  if (url.pathname === BASE) {
    res.writeHead(301, { Location: `${BASE}/` }).end();
    return;
  }
  const file = await resolve(url.pathname.slice(BASE.length));
  const status = file ? 200 : 404;
  const target = file ?? path.join(OUT, "404.html");
  res.writeHead(status, {
    "Content-Type": TYPES[path.extname(target)] ?? "application/octet-stream",
  });
  createReadStream(target).pipe(res);
});

server.listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`));
