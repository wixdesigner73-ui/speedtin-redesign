import * as THREE from "three";

// Soft-edged emitter texture: a rounded-rectangle falloff so highlights read as softbox
// reflections (long, feathered) instead of hard-edged rectangles.
function softTexture(feather = 0.35) {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  const img = g.createImageData(s, s);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const u = Math.min(x, s - 1 - x) / (s * 0.5);
      const v = Math.min(y, s - 1 - y) / (s * 0.5);
      const e = Math.min(1, Math.min(u, v) / feather);
      const k = Math.pow(e * e * (3 - 2 * e), 1.4) * 255;
      const i = (y * s + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = k;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

// A dark studio with a few area lights. PMREM-filtered, it gives glass the long, clean highlights
// you see in dark-field drinks photography. All values are HDR (>1) so reflections can bloom.
export function makeEnvironment(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030201);
  const soft = softTexture();

  const panel = (w, h, pos, color, intensity) => {
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), map: soft, side: THREE.DoubleSide });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(...pos);
    m.lookAt(0, 1.2, 0);
    scene.add(m);
  };

  panel(2.8, 11, [8, 2, 3.2], 0xffb36b, 30); // tall amber strip, right-front
  panel(2.0, 11, [-8, 2, 2.4], 0xeaf1ff, 26); // tall cool strip, left-front
  panel(8, 5, [-5, 7.5, 3], 0xfff0de, 6); // large warm key, top-left
  panel(0.9, 10, [5.4, 2, 6.8], 0xfff4e6, 38); // narrow strip near the lens axis, right: long bowl highlight
  panel(0.7, 10, [-5.2, 2, 7], 0xdfe9ff, 30); // narrow strip near the lens axis, left
  panel(6, 2.6, [0, 3.2, -9], 0xffa27d, 1.3); // warm back wall: faint lift on the liquid mirror
  panel(5, 5, [0, 10, 0], 0xffffff, 2); // overhead
  panel(11, 2, [0, -2, -8], 0xff5470, 5); // low ruby kicker behind
  panel(4, 3, [2.5, 3.2, 8], 0xffe2c4, 7); // front catchlight

  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(scene, 0.012);
  pmrem.dispose();
  soft.dispose();
  scene.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) o.material.dispose();
  });
  return rt.texture;
}
