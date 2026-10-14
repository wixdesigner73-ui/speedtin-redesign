import { chromium } from "playwright";
const [, , url, out] = process.argv;
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bad = []; p.on("response", r => { if (r.status() >= 400) bad.push(r.status() + " " + r.url()); }); p.on("pageerror", e => bad.push("ERR " + e.message));
await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(6000);
await p.screenshot({ path: out, timeout: 120000 });
console.log("bad:", bad.slice(0, 8));
await b.close();
