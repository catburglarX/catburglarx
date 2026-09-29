// Prints /resume to a one-page A4 PDF in out/, so the download always
// matches the web page. Run after `pnpm build`; the deploy workflow does.
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const PORT = 4174;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/catburglarx";
const OUT = path.resolve(import.meta.dirname, "..", "out", "antra-kumari-resume.pdf");

const server = spawn(process.execPath, [path.join(import.meta.dirname, "serve.mjs")], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: "ignore",
});

try {
  const url = `http://localhost:${PORT}${BASE}/resume/`;
  for (let i = 0; i < 50; i += 1) {
    if (
      await fetch(url)
        .then((r) => r.ok)
        .catch(() => false)
    )
      break;
    await new Promise((r) => setTimeout(r, 100));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  await browser.close();

  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  if (pages !== 1) throw new Error(`The résumé printed on ${pages} pages. It has to fit on one.`);
  await writeFile(OUT, pdf);
  console.log(
    `Wrote ${path.relative(process.cwd(), OUT)} (1 page, ${(pdf.length / 1024).toFixed(0)} KB).`,
  );
} finally {
  server.kill();
}
