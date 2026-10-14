// node tools/map.mjs <url> [w] [h]   -> prints top offsets of each top-level section
import { chromium } from "playwright";
const [, , url, w = "1440", h = "900"] = process.argv;
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(2500);
const out = await page.evaluate(() => {
  const secs = [...document.querySelectorAll("main > section, main > header, main > div > section, footer")];
  return { total: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    secs: secs.map((s) => ({ cls: s.className.toString().split(" ")[0], top: Math.round(s.getBoundingClientRect().top + scrollY), h: Math.round(s.getBoundingClientRect().height) })) };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
