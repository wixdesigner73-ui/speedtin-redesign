import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
const p = await b.newPage();
const r = await p.evaluate(() => { const c=document.createElement("canvas"); const gl=c.getContext("webgl2"); return gl? gl.getParameter(gl.VERSION):"NO WEBGL2"; });
console.log(r); await b.close();
