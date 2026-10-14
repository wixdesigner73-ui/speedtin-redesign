import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { makeGlassMaterial, makeLiquidMaterial, makeCitrusTexture } from "./materials";

// Cloudy ice core: soft white veins, so a cube reads as ice rather than clear plastic.
function frostTexture(seed = 1) {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  g.fillStyle = "#000";
  g.fillRect(0, 0, s, s);
  let r = seed * 9301 + 49297;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 26; i++) {
    g.beginPath();
    const x = rnd() * s, y = rnd() * s;
    g.moveTo(x, y);
    for (let k = 0; k < 5; k++) g.lineTo(x + (rnd() - 0.5) * 120, y + (rnd() - 0.5) * 120);
    g.strokeStyle = `rgba(255,255,255,${0.1 + rnd() * 0.45})`;
    g.lineWidth = 0.6 + rnd() * 2.4;
    g.stroke();
  }
  for (let i = 0; i < 40; i++) {
    const x = rnd() * s, y = rnd() * s, rad = 8 + rnd() * 34;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(255,255,255,${0.12 + rnd() * 0.18})`);
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

export function makeIceCube(seed = 1) {
  const group = new THREE.Group();
  const outer = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 8, 0.1), makeGlassMaterial({ edge: 0.9, core: 0.1, power: 1.6, envIntensity: 3.2 }));
  outer.renderOrder = 3;
  const frostMap = frostTexture(seed);
  const core = new THREE.Mesh(
    new RoundedBoxGeometry(0.8, 0.8, 0.8, 6, 0.1),
    new THREE.MeshPhysicalMaterial({
      color: 0xf4faff,
      alphaMap: frostMap,
      transparent: true,
      opacity: 0.95,
      roughness: 0.5,
      metalness: 0,
      emissive: 0xdcecfa,
      emissiveIntensity: 1.35,
      envMapIntensity: 1.4,
      depthWrite: false,
    })
  );
  core.renderOrder = 2;
  // faint cool body so the cube separates from a dark ground
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(0.97, 0.97, 0.97, 6, 0.1),
    new THREE.MeshPhysicalMaterial({ color: 0xf2f9ff, transparent: true, opacity: 0.66, roughness: 0.1, envMapIntensity: 3.0, emissive: 0xcfe6f8, emissiveIntensity: 0.55, depthWrite: false })
  );
  body.renderOrder = 1;
  group.add(body, core, outer);
  return group;
}

// Citrus wheel, tilted to show its face and its thickness.
export function makeCitrusWheel(kind = "lime") {
  const tex = makeCitrusTexture(
    kind === "lemon"
      ? { rind: "#e6b61a", pith: "#fbf3c4", flesh: "#f4dc4a", flesh2: "#eccb2e" }
      : {}
  );
  const side = new THREE.MeshStandardMaterial({ color: kind === "lemon" ? 0xe6b61a : 0x3f8a2c, roughness: 0.5 });
  const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.07 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 64), [side, face, face]);
  return m;
}

// A curled strip of citrus zest: a flat ribbon wrapped around a cylinder (width along the axis).
export function makePeel() {
  const turns = 2.6, steps = 200, width = 0.2, R = 0.2, H = 1.5;
  const pos = [], idx = [], uv = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * Math.PI * 2 * turns;
    const r = R * (1 - t * 0.18);
    const y = (t - 0.5) * H;
    const cx = Math.cos(a) * r, cz = Math.sin(a) * r;
    for (const k of [-1, 1]) pos.push(cx, y + k * (width / 2) * (1 - t * 0.35), cz);
    uv.push(t * 12, 0, t * 12, 1);
    if (i < steps) { const o = i * 2; idx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, "#d8760c"); gr.addColorStop(0.5, "#f3a21e"); gr.addColorStop(1, "#d8760c");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = "rgba(" + (110 + Math.random() * 70) + "," + (50 + Math.random() * 40) + ",5," + (0.16 + Math.random() * 0.3) + ")";
    g.beginPath(); g.arc(Math.random() * 256, Math.random() * 256, 0.7 + Math.random() * 2, 0, Math.PI * 2); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  const outer = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: tex, bumpMap: tex, bumpScale: 1.2, roughness: 0.38, clearcoat: 0.5, side: THREE.FrontSide }));
  const inner = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xf6ecc0, roughness: 0.7, side: THREE.BackSide }));
  const grp = new THREE.Group();
  grp.add(outer, inner);
  return grp;
}

export function makeDroplet() {
  const grp = new THREE.Group();
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.46, 48, 32), new THREE.MeshPhysicalMaterial({ color: 0xff3a64, emissive: 0xa81238, emissiveIntensity: 1.3, transparent: true, opacity: 0.5, roughness: 0.1, envMapIntensity: 0.8, depthWrite: false }));
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 32), makeGlassMaterial({ edge: 0.95, core: 0.05, power: 1.8, envIntensity: 4 }));
  inner.renderOrder = 1; shell.renderOrder = 3;
  grp.add(inner, shell);
  grp.scale.set(1, 1.16, 1);
  return grp;
}
