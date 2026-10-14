// node tools/shot.mjs <url> <out.png> [--w 1440] [--h 900] [--scroll 0] [--wait 1500] [--full] [--transparent] [--ready] [--dpr 1]
import { chromium } from "playwright";
const [, , url, out, ...rest] = process.argv;
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i > -1 ? rest[i + 1] : d; };
const has = (k) => rest.includes(`--${k}`);
const w = +opt("w", 1440), h = +opt("h", 900);
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: +opt("dpr", 1), reducedMotion: has("reduced") ? "reduce" : "no-preference" });
const page = await ctx.newPage();
const logs = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: "load" });
if (has("ready")) { try { await page.waitForFunction(() => window.__ready === true, null, { timeout: 15000 }); } catch (e) { console.log(logs.join("\n") || "no console output"); await browser.close(); process.exit(1); } }
await page.waitForTimeout(+opt("wait", 1500));
const sc = +opt("scroll", 0);
if (sc) {
  // step the scroll so scroll-linked effects update like a real user scroll
  const steps = 12;
  for (let i = 1; i <= steps; i++) { await page.evaluate((y) => window.scrollTo(0, y), (sc * i) / steps); await page.waitForTimeout(60); }
  await page.waitForTimeout(+opt("settle", 900));
}
await page.screenshot({ path: out, fullPage: has("full"), omitBackground: has("transparent"), timeout: 120000 });
if (logs.length) console.log(logs.slice(0, 12).join("\n"));
console.log("shot", out);
await browser.close();
