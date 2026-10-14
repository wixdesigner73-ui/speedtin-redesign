// The liquid stream. A lightweight 2D canvas that is positioned over the page from the shaker's
// spout to the surface of the liquid in the 3D glass. It is drawn from the live positions of both
// ends every frame, so it stays physically connected through scrolling, tilting and parallax.
//
//   draw({ O, I, t, dt, head, tail, flow, scale })
//     O, I   endpoints in canvas CSS px (spout, liquid surface)
//     head   0..1  how far the stream has travelled from the spout (intro)
//     tail   0..1  how far the top of the stream has receded toward the glass (pour finishing)
//     flow   0..1  intensity (width, spray, ripples)
//     scale  px multiplier for stream width (smaller on phones)

const smooth = (t) => t * t * (3 - 2 * t);

export function createStream(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext("2d");
  let dpr = 1;
  let cssW = 0, cssH = 0;
  const drops = [];
  const spray = [];
  let spawnAcc = 0;
  let sprayAcc = 0;

  function resize(w, h, ratio = Math.min(window.devicePixelRatio || 1, 1.6)) {
    cssW = Math.ceil(w); cssH = Math.ceil(h); dpr = ratio;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
  }

  const rnd = (a, b) => a + Math.random() * (b - a);

  function centre(O, I, s, t, L, scale) {
    const e = smooth(Math.min(1, s * 1.15));
    const wob = reduced ? 0 : Math.sin(t * 3.1 + s * 9) * (0.3 + 1.6 * s) * scale + Math.sin(t * 5.3 + s * 21) * 0.5 * s * scale;
    return O.x + (I.x - O.x) * e + wob;
  }

  function width(s, flow, scale, t = 0) {
    const base = 19.5 * scale * (0.42 + 0.58 * flow);
    const thin = 1 - 0.46 * smooth(Math.min(1, s * 1.1)); // a falling stream necks down
    const flare = 0.78 + 0.22 * smooth(Math.min(1, s / 0.08)); // slightly fanned as it leaves the lip
    const swell = reduced ? 1 : 1 + 0.055 * Math.sin(s * 26 - t * 9) * smooth(Math.min(1, s * 3));
    return base * thin * flare * swell;
  }

  function draw({ O, I, t, dt = 0.016, head = 1, tail = 0, flow = 1, scale = 1 }) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    const L = I.y - O.y;
    if (L < 8 || flow <= 0.001 || tail >= 0.999 || head <= 0.001) {
      drops.length = 0; spray.length = 0;
      return;
    }
    const s0 = tail, s1 = Math.min(1, head);
    const N = Math.max(24, Math.round(Math.min(120, L / 8)));
    const left = [], right = [], mid = [];
    for (let i = 0; i <= N; i++) {
      const s = s0 + ((s1 - s0) * i) / N;
      const y = O.y + s * L;
      const xc = centre(O, I, s, t, L, scale);
      const w = width(s, flow, scale, t);
      // the leading end of a young stream is a rounded blob
      const capped = head < 1 && i === N ? w * 1.15 : w;
      left.push([xc - capped / 2, y, w]);
      right.push([xc + capped / 2, y, w]);
      mid.push([xc, y, w]);
    }

    const trace = (pts) => { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); };

    // body: translucent ruby. Dark, saturated edges (more liquid in the line of sight) and a
    // lighter, clearer core where more light passes through, so the background shows a little.
    ctx.save();
    ctx.beginPath();
    trace(left);
    for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
    ctx.closePath();
    const hw = 21 * scale;
    const g = ctx.createLinearGradient(mid[0][0] - hw, 0, mid[0][0] + hw, 0);
    g.addColorStop(0, "rgba(72,6,26,0.9)");
    g.addColorStop(0.15, "rgba(156,18,52,0.86)");
    g.addColorStop(0.38, "rgba(214,40,80,0.74)");
    g.addColorStop(0.52, "rgba(240,86,110,0.6)");
    g.addColorStop(0.7, "rgba(196,28,68,0.76)");
    g.addColorStop(0.9, "rgba(118,10,38,0.88)");
    g.addColorStop(1, "rgba(60,4,20,0.92)");
    ctx.fillStyle = g;
    ctx.fill();
    // thin rim light on both boundaries: this is what makes it read as a liquid surface
    ctx.lineWidth = 1.1;
    ctx.beginPath(); trace(left); ctx.strokeStyle = "rgba(255,214,206,0.6)"; ctx.stroke();
    ctx.beginPath(); trace(right); ctx.strokeStyle = "rgba(255,160,140,0.42)"; ctx.stroke();
    ctx.restore();

    // specular: a soft bloom, a crisp highlight on the lit (left) side, a dark core line on the shaded side
    const off = (pts, k) => pts.map(([x, y, w]) => [x + k * w, y, w]);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath(); trace(off(mid, -0.2));
    ctx.lineWidth = Math.max(3, 8 * scale);
    ctx.strokeStyle = "rgba(255,226,220,0.14)";
    ctx.stroke();
    ctx.beginPath(); trace(off(mid, -0.24));
    ctx.lineWidth = Math.max(1.3, 2.6 * scale);
    ctx.strokeStyle = "rgba(255,246,240,0.92)";
    ctx.stroke();
    ctx.beginPath(); trace(off(mid, 0.2));
    ctx.lineWidth = Math.max(1.5, 3.4 * scale);
    ctx.strokeStyle = "rgba(60,4,20,0.34)";
    ctx.stroke();
    if (!reduced) {
      // slow bands of light travelling down the stream
      ctx.setLineDash([40 * scale, 34 * scale, 12 * scale, 52 * scale]);
      ctx.lineDashOffset = -t * 320 * scale;
    }
    ctx.beginPath(); trace(off(mid, 0.02));
    ctx.lineWidth = Math.max(1, 1.8 * scale);
    ctx.strokeStyle = "rgba(255,200,196,0.38)";
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); trace(off(mid, 0.3));
    ctx.lineWidth = Math.max(0.8, 1.4 * scale);
    ctx.strokeStyle = "rgba(255,150,110,0.5)"; // warm bounce from the amber strip light
    ctx.stroke();
    ctx.restore();

    // a young stream ends in a bead
    if (head < 1) {
      const e = mid[mid.length - 1];
      ctx.beginPath();
      ctx.ellipse(e[0], e[1] + 2, e[2] * 0.62, e[2] * 0.85, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(240,70,104,0.9)";
      ctx.fill();
    }

    if (reduced) return;

    // detached droplets alongside the lower stream
    spawnAcc += dt * 9 * flow;
    while (spawnAcc > 1) {
      spawnAcc -= 1;
      const s = rnd(0.35, 0.95);
      if (s < s0 || s > s1) continue;
      const xc = centre(O, I, s, t, L, scale);
      drops.push({ x: xc + rnd(-3, 3) * scale, y: O.y + s * L, vx: rnd(-14, 14) * scale, vy: rnd(160, 320), r: rnd(1.8, 4.2) * scale });
    }
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.vy += 1900 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
      if (d.y > I.y) { drops.splice(i, 1); continue; }
      drawBead(d.x, d.y, d.r);
    }

    // spray where the stream breaks the surface
    if (s1 >= 1) {
      sprayAcc += dt * 34 * flow * (1 - smooth(Math.min(1, tail * 1.4)));
      while (sprayAcc > 1) {
        sprayAcc -= 1;
        const dir = Math.random() < 0.5 ? -1 : 1;
        spray.push({ x: I.x + rnd(-3, 3) * scale, y: I.y, vx: dir * rnd(35, 150) * scale, vy: -rnd(110, 300), r: rnd(1.3, 3.4) * scale, life: 1 });
      }
    }
    for (let i = spray.length - 1; i >= 0; i--) {
      const p = spray[i];
      p.vy += 1700 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.y > I.y + 1 && p.vy > 0) { spray.splice(i, 1); continue; }
      drawBead(p.x, p.y, p.r);
    }
    if (s1 >= 1) {
      // soft glow at the impact point
      const rg = ctx.createRadialGradient(I.x, I.y, 0, I.x, I.y, 26 * scale);
      rg.addColorStop(0, `rgba(255,120,140,${0.28 * flow})`);
      rg.addColorStop(1, "rgba(255,120,140,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(I.x - 30 * scale, I.y - 30 * scale, 60 * scale, 60 * scale);
    }
  }

  function drawBead(x, y, r) {
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, 0, x, y, r * 1.2);
    g.addColorStop(0, "rgba(255,236,232,0.95)");
    g.addColorStop(0.35, "rgba(246,98,126,0.92)");
    g.addColorStop(1, "rgba(150,22,56,0.85)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 1.25, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function clear() { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cssW, cssH); }

  return { draw, resize, clear };
}
