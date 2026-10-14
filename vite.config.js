import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// fx.html is a dev-only page used by scripts/render-fx.mjs to pre-render the glass/ice/lime sprites.
// SITE_BASE=/repo-name/ builds for a sub-path host such as GitHub Pages (asset URLs and the router follow it).
const base = process.env.SITE_BASE || "/";
const rebaseMedia = {
  name: "rebase-media-urls",
  enforce: "pre",
  transform(code, id) {
    if (base === "/" || !/\/src\/.*\.(jsx?|css)$/.test(id.replace(/\\/g, "/"))) return null;
    return code.replace(/(["'`(])\/media\//g, `$1${base}media/`);
  },
};

export default defineConfig(({ command }) => ({
  base,
  plugins: [rebaseMedia, react()],
  build: {
    target: "es2020",
    rollupOptions: {
      input: command === "serve" ? { main: resolve("index.html"), fx: resolve("fx.html") } : { main: resolve("index.html") },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/gsap")) return "gsap";
        },
      },
    },
  },
}));
