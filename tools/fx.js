// Dev-only render page used by scripts/render-fx.mjs and for visual checks.
// Query: ?scene=glass|ice|lime|lemon|peel|drop &fill &w &h &dark &yaw &flow &rx &ry &rz &seed &dpr
import * as THREE from "three";
import { createCoupe } from "../src/gl/coupe.js";
import { makeEnvironment } from "../src/gl/env.js";
import { makeIceCube, makeCitrusWheel, makePeel, makeDroplet } from "../src/gl/props.js";

const q = new URLSearchParams(location.search);
const scene = q.get("scene") || "glass";
const w = +(q.get("w") || 640), h = +(q.get("h") || 820);
const canvas = document.getElementById("c");
if (q.get("dark")) document.body.classList.add("dark");
const num = (k, d) => (q.get(k) == null ? d : +q.get(k));

if (scene === "glass") {
  const coupe = createCoupe(canvas, { fill: num("fill", 0.8) });
  coupe.setSize(w, h, num("dpr", 1));
  coupe.update(0.016, num("flow", 0), num("yaw", 0));
  coupe.render();
  window.__coupe = coupe;
  if (q.get("hide") === "glass") { coupe.group.children[0].visible = false; coupe.render(); }
  if (q.get("hide") === "liquid") { coupe.group.children[1].visible = false; coupe.group.children[2].visible = false; coupe.render(); }
} else {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(num("dpr", 2));
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const sc = new THREE.Scene();
  sc.environment = makeEnvironment(renderer);
  const cam = new THREE.PerspectiveCamera(22, w / h, 0.1, 50);
  cam.position.set(0, 0.4, 7.2);
  cam.lookAt(0, 0, 0);
  // a little direct light so non-glass props (citrus, zest) have form
  const key = new THREE.DirectionalLight(0xfff0dd, 2.4);
  key.position.set(-3, 4, 5);
  const rim = new THREE.DirectionalLight(0xffb070, 1.6);
  rim.position.set(4, 1, -3);
  sc.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35));

  let obj;
  if (scene === "ice") obj = makeIceCube(num("seed", 1));
  if (scene === "lime") obj = makeCitrusWheel("lime");
  if (scene === "lemon") obj = makeCitrusWheel("lemon");
  if (scene === "peel") obj = makePeel();
  if (scene === "drop") obj = makeDroplet();
  obj.rotation.set(num("rx", 0.5), num("ry", 0.6), num("rz", 0.15));
  sc.add(obj);
  renderer.render(sc, cam);
  window.__r = { renderer, sc, cam };
}
window.__ready = true;
