// Pre-renders the decorative sprites (ice, citrus, zest, droplets) to transparent WebP files in
// public/media/fx, using the same Three.js glass/liquid materials as the live glass.
//
//   npm run dev            (in one terminal: serves /fx.html)
//   node scripts/render-fx.mjs [http://localhost:5173]
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || "http://localhost:5173";
const out = path.resolve(here, "../public/media/fx");
fs.mkdirSync(out, { recursive: true });

const jobs = [
  ["ice-1", "scene=ice&seed=1&rx=0.55&ry=0.7&rz=0.1"],
  ["ice-2", "scene=ice&seed=4&rx=0.9&ry=-0.5&rz=0.4"],
  ["ice-3", "scene=ice&seed=7&rx=-0.4&ry=0.95&rz=-0.2"],
  ["lime", "scene=lime&rx=1.0&ry=0.5&rz=0.2"],
  ["lemon", "scene=lemon&rx=0.95&ry=-0.55&rz=-0.25"],
  ["peel", "scene=peel&rx=0.25&ry=0.4&rz=0.45"],
  ["drop", "scene=drop"],
];

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
for (const [name, qs] of jobs) {
  const page = await browser.newPage({ viewport: { width: 560, height: 560 }, deviceScaleFactor: 1 });
  await page.goto(`${base}/fx.html?${qs}&w=560&h=560&dpr=2`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
  await page.waitForTimeout(400);
  const buf = await page.locator("canvas").screenshot({ omitBackground: true });
  const info = await sharp(buf).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 }).webp({ quality: 90, alphaQuality: 95 }).toFile(path.join(out, `${name}.webp`));
  console.log("fx", name, `${info.width}x${info.height}`);
  await page.close();
}
await browser.close();
