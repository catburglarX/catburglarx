// Turns the source images in assets/source into the files the site serves.
// Run with `pnpm assets` after adding or replacing an image. The output is
// committed, so a normal build never needs sharp or the originals.
import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = (...p) => path.join(root, "assets", "source", ...p);
const out = (...p) => path.join(root, "public", ...p);

// Must match images.deviceSizes and images.imageSizes in next.config.ts.
const PHOTO_WIDTHS = [640, 960, 1280];
const LOGO_WIDTHS = [64, 128, 256];

const jobs = [
  { name: "avatar", file: "avatar.png", widths: LOGO_WIDTHS },
  { name: "poornima", file: "logos/poornima.png", widths: LOGO_WIDTHS },
  { name: "birla-open-minds", file: "logos/birla-open-minds.png", widths: LOGO_WIDTHS },
  { name: "banasthali", file: "logos/banasthali.jpg", widths: LOGO_WIDTHS },
  { name: "sih", file: "logos/sih.jpg", widths: LOGO_WIDTHS },
  // Screenshots are cropped to 16:10 from the top so every card lines up.
  { name: "maanak-home", file: "screenshots/maanak-homepage.png", widths: PHOTO_WIDTHS, crop: 900 },
  {
    name: "maanak-services",
    file: "screenshots/maanak-public-services.png",
    widths: PHOTO_WIDTHS,
    crop: 900,
  },
  {
    name: "maanak-rules",
    file: "screenshots/maanak-rules-governance.png",
    widths: PHOTO_WIDTHS,
    crop: 900,
  },
  {
    name: "maanak-legal",
    file: "screenshots/maanak-legal-sources.png",
    widths: PHOTO_WIDTHS,
    crop: 900,
  },
];

async function base(job) {
  let img = sharp(src(job.file));
  if (job.crop) {
    const meta = await img.metadata();
    img = img.extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: Math.min(job.crop, meta.height),
    });
  }
  return sharp(await img.toBuffer());
}

async function processImage(job) {
  const image = await base(job);
  const meta = await image.metadata();
  for (const width of job.widths) {
    // Never upscale: a request for a wider file than the original gets the original size.
    await image
      .clone()
      .resize({ width: Math.min(width, meta.width), withoutEnlargement: true })
      .webp({ quality: job.crop ? 78 : 88, effort: 6 })
      .toFile(out("images", `${job.name}-${width}.webp`));
  }
  const blur = await image.clone().resize({ width: 12 }).webp({ quality: 40 }).toBuffer();
  return [
    job.name,
    {
      width: meta.width,
      height: meta.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    },
  ];
}

async function icons() {
  const avatar = sharp(src("avatar.png")).flatten({ background: "#fcc0d3" });
  await avatar
    .clone()
    .resize(192)
    .png()
    .toFile(path.join(root, "src", "app", "icon.png"));
  await avatar
    .clone()
    .resize(180)
    .png()
    .toFile(path.join(root, "src", "app", "apple-icon.png"));
  await avatar.clone().resize(192).png().toFile(out("icons", "icon-192.png"));
  await avatar.clone().resize(512).png().toFile(out("icons", "icon-512.png"));
  await avatar.clone().resize(512).png().toFile(out("avatar.png"));
}

async function tech() {
  const dir = src("tech");
  for (const file of await readdir(dir)) {
    if (file.endsWith(".svg")) await copyFile(path.join(dir, file), out("tech", file));
  }
}

await rm(out("images"), { recursive: true, force: true });
await mkdir(out("images"), { recursive: true });
await mkdir(out("icons"), { recursive: true });
await mkdir(out("tech"), { recursive: true });
await mkdir(path.join(root, "src", "generated"), { recursive: true });

const manifest = Object.fromEntries(await Promise.all(jobs.map(processImage)));
await writeFile(
  path.join(root, "src", "generated", "images.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await icons();
await tech();
console.log(`Processed ${jobs.length} images.`);
