import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const errs = [];
// mobile menu
let ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
let page = await ctx.newPage();
page.on("pageerror", (e) => errs.push(e.message));
await page.goto("http://localhost:5173/pages/learn-more", { waitUntil: "load" });
await page.waitForTimeout(3500);
await page.screenshot({ path: "shots/c2_mob_page.png", timeout: 120000 });
await page.click(".hdr__burger");
await page.waitForTimeout(2200);
await page.screenshot({ path: "shots/c2_mob_menu.png", timeout: 120000 });
await ctx.close();
// desktop mega
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
page.on("pageerror", (e) => errs.push(e.message));
await page.goto("http://localhost:5173/pages/contact-us", { waitUntil: "load" });
await page.waitForTimeout(3500);
await page.hover(".hdr__item");
await page.waitForTimeout(1000);
await page.screenshot({ path: "shots/c2_mega.png", timeout: 120000 });
// story sticky
await page.goto("http://localhost:5173/pages/about-us", { waitUntil: "load" });
await page.waitForTimeout(3000);
const top = await page.evaluate(() => document.querySelector(".story").getBoundingClientRect().top + scrollY);
for (const off of [200, 900]) {
  for (let i = 1; i <= 8; i++) { await page.evaluate((y) => window.scrollTo(0, y), top + (off * i) / 8); await page.waitForTimeout(60); }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `shots/c2_story_${off}.png`, timeout: 120000 });
  console.log("img top @", off, await page.evaluate(() => Math.round(document.querySelector(".story__img").getBoundingClientRect().top)));
}
console.log("errors:", errs.slice(0, 5));
await browser.close();
