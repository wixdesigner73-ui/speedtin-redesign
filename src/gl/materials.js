import * as THREE from "three";

// Glass: "reflections only". The base colour is black so nothing is added except specular + env
// reflection, and alpha rises with the Fresnel term so the silhouette reads crisply on a dark ground.
export function makeGlassMaterial({ edge = 0.98, core = 0.04, power = 2.1, envIntensity = 4.2 } = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: 0,
    roughness: 0.035,
    ior: 1.5,
    specularIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: envIntensity,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
      float ndv = clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
      float fres = pow(1.0 - ndv, ${power.toFixed(2)});
      diffuseColor.a = mix(${core.toFixed(3)}, ${edge.toFixed(3)}, fres);
      #include <opaque_fragment>
      `
    );
  };
  m.customProgramCacheKey = () => `glass-${edge}-${core}-${power}`;
  return m;
}

// Liquid: deep ruby body, brighter where the liquid is thin (grazing angles), glossy skin.
export function makeLiquidMaterial({ color = 0xf2305e, deep = 0xc4123e, opacity = 0.96 } = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.07,
    ior: 1.34,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.3,
    emissive: new THREE.Color(deep),
    emissiveIntensity: 1.4,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vH;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvH = position.y;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vH;")
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        // depth of liquid: deep, saturated ruby at the bottom of the bowl, lighter toward the surface
        float dep = smoothstep(1.36, 1.98, vH);
        diffuseColor.rgb *= mix(vec3(0.42, 0.05, 0.14), vec3(1.0), pow(dep, 0.8));`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `
        #include <emissivemap_fragment>
        float ndvL = clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
        totalEmissiveRadiance *= mix(0.35, 1.0, dep);
        // light scattering through the liquid: warm glow at the thin edges
        totalEmissiveRadiance += vec3(0.95, 0.18, 0.28) * pow(1.0 - ndvL, 1.8) * 0.7 * mix(0.5, 1.0, dep);
        `
      );
  };
  m.customProgramCacheKey = () => "liquid";
  return m;
}

// Citrus wheel texture: rind, pith, segmented flesh with membranes.
export function makeCitrusTexture({ rind = "#2f7d1f", pith = "#dfe9a8", flesh = "#86bf24", flesh2 = "#6fae1c", size = 512 } = {}) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const r = size / 2;
  g.translate(r, r);
  const disc = (rad, fill) => { g.beginPath(); g.arc(0, 0, rad, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); };
  disc(r * 0.995, rind);
  disc(r * 0.93, pith);
  const fleshR = r * 0.86;
  const segs = 10;
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI * 2 + 0.05;
    const a1 = ((i + 1) / segs) * Math.PI * 2 - 0.05;
    const grad = g.createRadialGradient(0, 0, r * 0.05, 0, 0, fleshR);
    grad.addColorStop(0, flesh2);
    grad.addColorStop(1, flesh);
    g.beginPath();
    g.moveTo(Math.cos((a0 + a1) / 2) * r * 0.07, Math.sin((a0 + a1) / 2) * r * 0.07);
    g.arc(0, 0, fleshR, a0, a1);
    g.closePath();
    g.fillStyle = grad;
    g.fill();
    // juice vesicles
    g.save();
    g.clip();
    for (let k = 0; k < 90; k++) {
      const a = a0 + Math.random() * (a1 - a0);
      const d = r * (0.12 + Math.random() * 0.72);
      g.fillStyle = `rgba(255,255,220,${0.06 + Math.random() * 0.12})`;
      g.beginPath();
      g.ellipse(Math.cos(a) * d, Math.sin(a) * d, 2 + Math.random() * 5, 8 + Math.random() * 14, a, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
  disc(r * 0.06, pith);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
