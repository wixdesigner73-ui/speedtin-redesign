import * as THREE from "three";
import { makeEnvironment } from "./env";
import { makeGlassMaterial, makeLiquidMaterial, makeCitrusTexture } from "./materials";

// Coupe profile (r, y). Units are arbitrary; the glass is ~2.1 tall.
const OUTER = [[0, 0], [0.56, 0], [0.6, 0.012], [0.585, 0.045], [0.42, 0.085], [0.2, 0.13], [0.085, 0.2], [0.052, 0.42], [0.046, 0.8], [0.052, 1.08], [0.09, 1.2], [0.2, 1.3], [0.38, 1.4], [0.58, 1.54], [0.73, 1.74], [0.79, 1.94], [0.78, 2.06]];
const RIM = [[0.77, 2.082], [0.752, 2.06]];
const INNER = [[0.748, 1.94], [0.69, 1.745], [0.545, 1.58], [0.36, 1.455], [0.17, 1.375], [0, 1.35]];
const LIQ = [[0, 1.354], [0.168, 1.378], [0.357, 1.458], [0.541, 1.583], [0.686, 1.748], [0.743, 1.94], [0.745, 2.1]];

const v2 = (a) => a.map(([x, y]) => new THREE.Vector2(x, y));
const spline = (a, n) => new THREE.SplineCurve(v2(a)).getPoints(n);

export const LEVEL_MIN = 1.372;
export const LEVEL_MAX = 1.99;

export function createCoupe(canvas, { segments = 96, maxDpr = 1.75, garnish = true, fill = 1 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  scene.environment = makeEnvironment(renderer);
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 60);
  const target = new THREE.Vector3(0, 1.2, 0);

  const group = new THREE.Group();
  scene.add(group);

  // ---- glass ----
  const glassPts = [...spline(OUTER, 120), ...v2(RIM), ...spline(INNER, 50)];
  const glass = new THREE.Mesh(new THREE.LatheGeometry(glassPts, segments), makeGlassMaterial());
  glass.renderOrder = 4;
  group.add(glass);

  // ---- liquid ----
  const liqPts = spline(LIQ, 60);
  const liqMat = makeLiquidMaterial();
  const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.9);
  liqMat.clippingPlanes = [plane];
  const liquid = new THREE.Mesh(new THREE.LatheGeometry(liqPts, segments), liqMat);
  liquid.renderOrder = 1;
  group.add(liquid);

  const radiusAt = (y) => {
    for (let i = 1; i < liqPts.length; i++) {
      if (liqPts[i].y >= y) {
        const a = liqPts[i - 1], b = liqPts[i];
        const t = (y - a.y) / Math.max(1e-6, b.y - a.y);
        return a.x + (b.x - a.x) * t;
      }
    }
    return liqPts[liqPts.length - 1].x;
  };

  // ---- rippling surface (polar grid, CPU-animated) ----
  const RINGS = 34, SEGS = 72;
  const verts = (RINGS + 1) * SEGS;
  const pos = new Float32Array(verts * 3);
  const nor = new Float32Array(verts * 3);
  const idx = [];
  for (let i = 0; i < RINGS; i++) {
    for (let j = 0; j < SEGS; j++) {
      const a = i * SEGS + j, b = i * SEGS + ((j + 1) % SEGS), c = (i + 1) * SEGS + j, d = (i + 1) * SEGS + ((j + 1) % SEGS);
      idx.push(a, c, b, b, c, d);
    }
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  sGeo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  sGeo.setIndex(idx);
  const surface = new THREE.Mesh(sGeo, liqMat.clone());
  surface.material.clippingPlanes = null;
  surface.material.envMapIntensity = 0.55;
  surface.material.clearcoat = 0.5;
  surface.material.emissive = new THREE.Color(0xe0245a);
  surface.material.emissiveIntensity = 0.72;
  surface.material.onBeforeCompile = liqMat.onBeforeCompile;
  surface.material.customProgramCacheKey = liqMat.customProgramCacheKey;
  surface.renderOrder = 2;
  surface.frustumCulled = false;
  group.add(surface);

  // ---- citrus wheel on the rim ----
  let lime = null;
  if (garnish) {
    const tex = makeCitrusTexture();
    const side = new THREE.MeshStandardMaterial({ color: 0x2f7a2a, roughness: 0.5 });
    const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.38, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.18 });
    lime = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.04, 56), [side, face, face]);
    lime.rotation.set(Math.PI / 2 - 0.1, 0, 0);
    lime.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.75);
    lime.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -0.2);
    lime.position.set(-0.74, 2.0, 0.12);
    lime.renderOrder = 0;
    group.add(lime);
  }

  let level = LEVEL_MIN + (LEVEL_MAX - LEVEL_MIN) * fill;
  let clock = 0;
  let amp = 0;
  const tmp = new THREE.Vector3();
  let W = 1, H = 1;

  function layoutSurface(flow, dt) {
    clock += dt;
    amp += (flow * 0.016 - amp) * Math.min(1, dt * 4);
    const R = radiusAt(level) * 0.992;
    for (let i = 0; i <= RINGS; i++) {
      const r = (i / RINGS) * R;
      const edge = 1 - Math.pow(r / R, 5);
      for (let j = 0; j < SEGS; j++) {
        const th = (j / SEGS) * Math.PI * 2;
        const hh = (rr) =>
          edge * (amp * Math.exp(-1.7 * rr) * Math.sin(26 * rr - 9.5 * clock) +
            amp * 0.38 * Math.exp(-1.1 * rr) * Math.sin(10 * rr - 6 * clock + 2.2 * Math.cos(2 * th + clock * 0.8)));
        const h0 = hh(r);
        const dh = (hh(r + 0.01) - h0) / 0.01;
        const k = (i * SEGS + j) * 3;
        pos[k] = Math.cos(th) * r;
        pos[k + 1] = level + h0;
        pos[k + 2] = Math.sin(th) * r;
        const nx = -dh * Math.cos(th), nz = -dh * Math.sin(th);
        const il = 1 / Math.hypot(nx, 1, nz);
        nor[k] = nx * il; nor[k + 1] = il; nor[k + 2] = nz * il;
      }
    }
    sGeo.attributes.position.needsUpdate = true;
    sGeo.attributes.normal.needsUpdate = true;
  }

  function fit() {
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const needH = 2.75, needW = 2.35;
    const dist = Math.max(needH / 2 / Math.tan(fov / 2), needW / 2 / (Math.tan(fov / 2) * camera.aspect)) * 1.04;
    const el = THREE.MathUtils.degToRad(17);
    camera.position.set(0, target.y + Math.sin(el) * dist, Math.cos(el) * dist);
    camera.lookAt(target);
    camera.updateMatrixWorld();
  }

  function setSize(w, h, dpr = Math.min(window.devicePixelRatio || 1, maxDpr)) {
    W = w; H = h;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fit();
  }

  function setFill(f) {
    level = LEVEL_MIN + (LEVEL_MAX - LEVEL_MIN) * Math.min(1, Math.max(0, f));
    plane.constant = level;
    surface.visible = f > 0.002;
  }

  // Screen position (CSS px, relative to the canvas) of the liquid surface: centre + radii.
  function surfaceScreen() {
    const R = radiusAt(level);
    const p = (x, y, z) => {
      tmp.set(x, y, z).applyMatrix4(group.matrixWorld).project(camera);
      return { x: (tmp.x * 0.5 + 0.5) * W, y: (-tmp.y * 0.5 + 0.5) * H };
    };
    const c = p(0, level, 0), e = p(R, level, 0), f = p(0, level, R);
    return { x: c.x, y: c.y, rx: Math.abs(e.x - c.x), ry: Math.abs(f.y - c.y), rimY: p(0, 2.06, -0.75).y };
  }

  function update(dt, flow, pointer = 0) {
    group.rotation.y = pointer * 0.22 + Math.sin(clock * 0.25) * 0.02;
    group.updateMatrixWorld(true);
    layoutSurface(flow, dt);
  }

  function render() { renderer.render(scene, camera); }

  function dispose() {
    renderer.dispose();
    scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  }

  setFill(fill);
  layoutSurface(0, 0);
  return { setSize, setFill, update, render, surfaceScreen, dispose, renderer, scene, camera, group, LEVEL_MIN, LEVEL_MAX };
}
