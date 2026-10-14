// Builds optimised web assets in /public/media from the originals downloaded from speedtin.com.
//
//   node scripts/build-assets.mjs [--src ../_research] [--only photos,cutouts,video]
//
// Inputs (see README "Asset pipeline"):
//   <src>/raw/img/*           original photography pulled from the live site's CDN
//   <src>/raw/vid/*.mp4       original videos pulled from the live site's CDN
//   <src>/matte/out_*.png     background-removed product cutouts (ML matte, @imgly/background-removal-node)
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const SRC = path.resolve(here, arg("src", "../../_research"));
const OUT = path.resolve(here, "../public/media");
const only = (arg("only", "photos,cutouts,video")).split(",");
const IMG = (f) => path.join(SRC, "raw/img", f);
const MAT = (f) => path.join(SRC, "matte", f);
const VID = (f) => path.join(SRC, "raw/vid", f);
fs.mkdirSync(OUT, { recursive: true });

const manifestPath = path.join(OUT, "manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const log = (...a) => console.log("•", ...a);

/* ---------- photos ---------- */
const photos = [
  // [output name, source, max width, quality, optional crop {left,top,width,height} as fractions]
  ["bar-pour-solo", "ST_2025-12-16_1050.jpg", 2200],
  ["bar-pour-trio", "ST_2025-12-16_1071.jpg", 2200],
  ["bar-duo", "ST_2025-12-16_1199.jpg", 2200],
  ["bar-team", "ST_2025-12-16_1251.jpg", 2200],
  ["restaurant", "ST_2025-12-16_2096.jpg", 2400],
  ["home-kitchen", "ST_2025-12-16_3038.jpg", 2200],
  ["home-kitchen-2", "ST_2025-12-16_3149.jpg", 2200],
  ["bartender-pour", "0A1A6146.jpg", 1800],
  ["bartender-double", "Image_from_Google_Drive.jpg", 1800],
  ["bartender-portrait", "IMG_0860.jpg", 1400],
  ["pour-orange", "Serve.jpg", 800],
  ["grips-bar", "HY4A7125.jpg", 2200],
  ["products-six", "R5_A2221.jpg", 2000],
  ["accessories-mat", "R5_A2235.jpg", 2000],
  ["std-studio", "R5_A2229.jpg", 1600],
  ["two-studio", "R5_A2225.jpg", 1524],
  ["pour-martini", "R5_A2414_-_2.jpg", 2200],
  ["pour-cosmo", "R5_A2343.jpg", 2200],
  ["shots-2-0", "R5_A2424.jpg", 2000],
  ["sled-detail", "R5_A2440.jpg", 2000],
  ["box-and-tins", "R5_A2231.jpg", 2000],
  ["box-pair", "R5_A2206.jpg", 2000],
  ["tins-and-box-2", "R5_A2234.jpg", 2000],
  ["anatomy", "image0.jpg", 1024],
  ["evolution", "SPEED_TIN_EVOLUTION.jpg", 1024],
  ["timeline", "SPEED_TIN_TIMELINE.jpg", 1024],
  ["wholesale-mood", "image_64.png", 1920],
  ["set-square", "GIVE_THE_GIFT_OF_SPEED_1.png", 975],
  ["bundle-1-graphic", "Speedtin_Bundle_Graphic.png", 1080],
  ["bundle-2-graphic", "Untitled.png", 1080],
  ["sled-photo", "0A1A6045.jpg", 1600],
  ["spring-photo", "0A1A6058_106bd5ff-1bb9-4665-b60f-d1f25e465d2a.jpg", 1600],
  ["home-bg-slate", "HomePageBackground_1.png", 1920],
];

async function buildPhotos() {
  for (const [name, file, w] of photos) {
    const src = IMG(file);
    if (!fs.existsSync(src)) { log("missing", file); continue; }
    const out = path.join(OUT, `${name}.webp`);
    const info = await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(out);
    manifest[name] = { w: info.width, h: info.height };
    log("photo", name, `${info.width}x${info.height}`, `${(info.size / 1024).toFixed(0)}KB`);
  }
  // Logos: keep alpha, lossless
  const logos = [
    ["logo-black", "WhatsApp_Image_2025-04-04_at_21.49.25_46d21883-removebg-preview_1457bf49-2036-4e53-b5b1-fffaab0d9497.png"],
    ["logo-white", "image_76.png"],
  ];
  for (const [name, file] of logos) {
    const info = await sharp(IMG(file)).trim().webp({ lossless: true }).toFile(path.join(OUT, `${name}.webp`));
    manifest[name] = { w: info.width, h: info.height };
    log("logo", name, `${info.width}x${info.height}`);
  }
  // Chrome lightning-bolt mark: white background -> alpha
  {
    const { data, info } = await sharp(IMG("PNG_image_1.jpg")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const a = Math.max(0, Math.min(1, (246 - lum) / 22));
      rgba[j] = data[i]; rgba[j + 1] = data[i + 1]; rgba[j + 2] = data[i + 2]; rgba[j + 3] = Math.round(a * 255);
    }
    const info2 = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 }, threshold: 1 })
      .resize({ width: 640 })
      .webp({ quality: 90 })
      .toFile(path.join(OUT, "bolt.webp"));
    manifest.bolt = { w: info2.width, h: info2.height };
    log("bolt", `${info2.width}x${info2.height}`);
  }
}

/* ---------- cutouts ---------- */
// Row/column cleanup is applied to the raw matte *before* trim so the coordinates are stable.
async function cutout(name, file, { cutBelow, cutAbove, band, ellipse, clearRect, fade = 0, width = 1400, grade, anchor } = {}) {
  let img = sharp(MAT(file));
  const meta = await img.metadata();
  let { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  if (cutBelow != null) {
    for (let y = Math.max(0, cutBelow - fade); y < H; y++) {
      const k = y >= cutBelow ? 0 : 1 - (y - (cutBelow - fade)) / fade;
      for (let x = band ? band[0] : 0; x < (band ? band[1] : W); x++) data[(y * W + x) * 4 + 3] = Math.round(data[(y * W + x) * 4 + 3] * k);
    }
  }
  if (cutAbove != null) {
    for (let y = 0; y < Math.min(H, cutAbove); y++) for (let x = 0; x < W; x++) data[(y * W + x) * 4 + 3] = 0;
  }
  if (clearRect) {
    const [x0, y0, x1, y1] = clearRect;
    for (let y = y0; y < Math.min(H, y1); y++) for (let x = x0; x < Math.min(W, x1); x++) data[(y * W + x) * 4 + 3] = 0;
  }
  if (ellipse) {
    // Remove cast shadow below a round base: below the ellipse's centre line, keep only what is inside the ellipse.
    const { cx, cy, rx, ry } = ellipse;
    for (let y = Math.floor(cy); y < H; y++) {
      for (let x = 0; x < W; x++) {
        const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
        const k = Math.max(0, Math.min(1, (1.014 - d) / 0.014));
        if (k < 1) data[(y * W + x) * 4 + 3] = Math.round(data[(y * W + x) * 4 + 3] * k);
      }
    }
  }
  let pipe = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  const trimmed = await pipe.png().toBuffer();
  const t = await sharp(trimmed).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 }).toBuffer({ resolveWithObject: true });
  const scale = Math.min(1, width / t.info.width);
  let out = sharp(t.data).resize({ width: Math.round(t.info.width * scale) });
  if (grade) out = out.modulate(grade);
  const res = await out.webp({ quality: 88, effort: 5, alphaQuality: 95 }).toFile(path.join(OUT, `${name}.webp`));
  manifest[name] = { w: res.width, h: res.height };
  if (anchor) {
    // sharp reports trim offsets as negative numbers (pixels removed from the left/top)
    const offX = t.info.trimOffsetLeft || 0, offY = t.info.trimOffsetTop || 0;
    manifest[name].anchor = { x: +(((anchor.x + offX) * scale) / res.width).toFixed(4), y: +(((anchor.y + offY) * scale) / res.height).toFixed(4) };
  }
  log("cutout", name, `${res.width}x${res.height}`, `${(res.size / 1024).toFixed(0)}KB`, meta.width + "x" + meta.height);
}

async function buildCutouts() {
  // Hero: real hand + Speed Tin. The photographed stream is removed below the lip; the site's own stream
  // starts at the anchor (the spout exit), expressed as a 0-1 fraction of the final image.
  await cutout("hero-hand", "out_hero.png", { cutBelow: 768, band: [262, 338], fade: 10, width: 1300, grade: { brightness: 0.94, saturation: 1.04 }, anchor: { x: 303, y: 766 } });
  await cutout("cut-standard", "out_standard.png", { ellipse: { cx: 1060, cy: 1440, rx: 172, ry: 55 }, clearRect: [1230, 1424, 2049, 2049], width: 1100 });
  await cutout("cut-2-0", "out_twooh.png", { width: 1000 });
  await cutout("cut-set", "out_set.png", { width: 975 });
  await cutout("cut-sled", "out_sled.png", { width: 1100 });
  await cutout("cut-spring", "out_spring.png", { width: 1100 });
  await cutout("cut-bundle-1", "out_bundle1.png", { cutBelow: 930, fade: 4, width: 975 });
  await cutout("cut-bundle-2", "out_bundle2.png", { cutBelow: 930, fade: 4, width: 975 });
}

/* ---------- video ---------- */
function ff(args) {
  execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}
function buildVideo() {
  const v = path.join(OUT, "video");
  fs.mkdirSync(v, { recursive: true });
  // 31s product + pour montage (this is the live site's own hero video).
  ff(["-i", VID("hero-bartender.mp4"), "-an", "-vf", "scale=1280:-2", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(v, "demo.mp4")]);
  ff(["-ss", "7", "-i", VID("hero-bartender.mp4"), "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "3", path.join(v, "demo-poster.jpg")]);
  // Vertical social clips (live site: social gallery). Kept with audio, 540x960.
  const social = [["social-1", "1a1500ae1c1746ebabb3ff59b5599844", 9], ["social-2", "62cf9bddaccd4d0db4560649fce99b03", 15], ["social-3", "98684296093e495f9391193ec7d95a21", 24]];
  for (const [name, id, posterAt] of social) {
    ff(["-i", VID(`${id}.mp4`), "-vf", "scale=540:-2", "-c:v", "libx264", "-crf", "29", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "80k", "-movflags", "+faststart", path.join(v, `${name}.mp4`)]);
    ff(["-ss", String(posterAt), "-i", VID(`${id}.mp4`), "-frames:v", "1", "-vf", "scale=540:-2", "-q:v", "4", path.join(v, `${name}-poster.jpg`)]);
  }
  // Kickstarter film is 44 MB: it is streamed from the live site's CDN (see src/data/site.js), poster only here.
  ff(["-ss", "20", "-i", VID("kickstarter.mp4"), "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "3", path.join(v, "kickstarter-poster.jpg")]);
  log("video done");
}

if (only.includes("photos")) await buildPhotos();
if (only.includes("cutouts")) await buildCutouts();
if (only.includes("video")) buildVideo();
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
log("manifest written");
