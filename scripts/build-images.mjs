// Pre-builds resized WebP copies of every photo in /public so the static site serves small, cacheable files.
import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUB = path.resolve("public");
const OUT = path.join(PUB, "_img");
const WIDTHS = [256, 384, 640, 828, 1080, 1280, 1920];
const SKIP = new Set(["_img", "docs"]);

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name) && dir === PUB) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) yield p;
  }
}

const jobs = [];
for await (const file of walk(PUB)) jobs.push(file);
let made = 0;
const t0 = Date.now();
await Promise.all(
  Array.from({ length: 6 }, async (_, k) => {
    for (let i = k; i < jobs.length; i += 6) {
      const file = jobs[i];
      const rel = path.relative(PUB, file).replace(/\.[^.]+$/, "");
      const src = await stat(file);
      for (const w of WIDTHS) {
        const dest = path.join(OUT, `${rel}-${w}.webp`);
        try { if ((await stat(dest)).mtimeMs >= src.mtimeMs) continue; } catch {}
        await mkdir(path.dirname(dest), { recursive: true });
        await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 4 }).toFile(dest);
        made++;
      }
    }
  })
);
console.log(`images: ${jobs.length} sources, ${made} variants built in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
