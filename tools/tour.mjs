// node tools/tour.mjs <url> <outPrefix> <y1,y2,...> [--w 1440] [--h 900] [--settle 1200] [--dpr 1] [--touch]
import { chromium } from "playwright";
const [, , url, prefix, ysArg, ...rest] = process.argv;
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i > -1 ? rest[i + 1] : d; };
const w = +opt("w", 1440), h = +opt("h", 900), settle = +opt("settle", 1200);
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: +opt("dpr", 1), hasTouch: rest.includes("--touch"), isMobile: rest.includes("--touch") });
const page = await ctx.newPage();
const logs = [];
page.on("console", (m) => { if (["error"].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(3500);
let cur = 0;
for (const y of ysArg.split(",").map(Number)) {
  const dist = y - cur;
  const steps = Math.max(1, Math.ceil(Math.abs(dist) / 350));
  for (let i = 1; i <= steps; i++) { await page.evaluate((v) => window.scrollTo(0, v), cur + (dist * i) / steps); await page.waitForTimeout(70); }
  cur = y;
  await page.waitForTimeout(settle);
  const f = `${prefix}_${y}.png`;
  await page.screenshot({ path: f, timeout: 120000 });
  console.log("shot", f);
}
if (logs.length) console.log(logs.slice(0, 10).join("\n"));
await browser.close();
