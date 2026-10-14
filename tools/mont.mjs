// node tools/mont.mjs out.jpg cols file1 file2 ...   (each tile scaled to 720px wide)
import sharp from "sharp";
const [, , out, colsArg, ...files] = process.argv;
const cols = +colsArg, tw = 720;
const tiles = await Promise.all(files.map(async (f) => { const b = await sharp(f).resize({ width: tw }).toBuffer(); const m = await sharp(b).metadata(); return { b, h: m.height }; }));
const th = Math.max(...tiles.map((t) => t.h));
const rows = Math.ceil(tiles.length / cols);
await sharp({ create: { width: tw * cols, height: th * rows, channels: 3, background: "#000" } })
  .composite(tiles.map((t, i) => ({ input: t.b, left: (i % cols) * tw, top: Math.floor(i / cols) * th }))).jpeg({ quality: 84 }).toFile(out);
console.log("ok", out);
