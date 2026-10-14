import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../lib/motion";
import { hero, difference } from "../data/site";
import { clamp, smooth, prefersReducedMotion } from "../lib/format";
import manifest from "../../public/media/manifest.json";
import { Arrow } from "./Icons";
import "../styles/pour.css";

const H = manifest["hero-hand"];
// Each line is from the live site: the bartender copy, the product tagline and the Set description.
const benefitsCopy = {
  "Built-in Strainer": "Never look for a strainer again!",
  "Easy to Use": "Shake. Strain. Pour. One hand.",
  "High Quality Stainless Steel": "Crafted from high-grade stainless steel for durability and aesthetic.",
};

export default function PourStage() {
  const stageRef = useRef(null);
  const handRef = useRef(null);
  const handInnerRef = useRef(null);
  const anchorRef = useRef(null);
  const glassWrapRef = useRef(null);
  const glassCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const FAST = new URLSearchParams(location.search).has("fast"); // dev/QA only: skips the slow software-GL intro
    const stage = stageRef.current;
    const inner = handInnerRef.current;
    const anchor = anchorRef.current;
    const wrap = glassWrapRef.current;
    const glassCanvas = glassCanvasRef.current;
    const streamCanvas = streamRef.current;
    let disposed = false;
    let raf = 0;
    let coupe = null;
    let stream = null;
    let ro = null;
    let io = null;
    let visible = true;
    let glassVisible = true;
    let ioGlass = null;
    let onMove = null;

    const S = { intro: reduced ? 1 : 0, introOn: reduced, pointer: 0, pointerTarget: 0, px: 0, py: 0, tilt: 0, fill: reduced ? 1 : 0, last: performance.now(), sizeW: 0, sizeH: 0, t: 0 };

    // intro: headline, hand, CTA. The stream starts once the hand has settled.
    const ctx = gsap.context(() => {
      const lines = copyRef.current.querySelectorAll(".js-line > span");
      if (reduced) {
        gsap.set(lines, { yPercent: 0 });
        gsap.set(".js-fade", { opacity: 1 });
        return;
      }
      gsap.set(lines, { yPercent: 112 });
      gsap.set(".js-fade", { opacity: 0, y: 24 });
      gsap.set(inner, { y: -170, x: 90, rotation: 7, opacity: 0, transformOrigin: "94% 8%" });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.15 });
      if (FAST) tl.timeScale(12);
      tl.to(".pour__bg-glow", { opacity: 1, duration: 2.2, ease: "power2.out" }, 0)
        .to(lines, { yPercent: 0, duration: 1.35, stagger: 0.11 }, 0.25)
        .to(inner, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 1.9, ease: "expo.out" }, 0.1)
        .to(".js-fade", { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.95)
        .call(() => { S.introOn = true; }, null, 1.15);
    }, stage);

    // ---------- 3D glass + 2D stream ----------
    (async () => {
      const [{ createCoupe }, { createStream }] = await Promise.all([import("../gl/coupe"), import("../gl/stream")]);
      if (disposed) return;
      const small = window.innerWidth < 760;
      try {
        coupe = createCoupe(glassCanvas, { segments: small ? 64 : 96, maxDpr: small ? 1.4 : 1.75, fill: reduced ? 1 : 0.0 });
      } catch (e) {
        // no WebGL: the stream and copy still work, the glass canvas is simply left empty
        console.warn("Speed Tin glass: WebGL unavailable", e);
        wrap.classList.add("no-gl");
        return;
      }
      stream = createStream(streamCanvas, { reduced });
      const fitGlass = () => {
        const r = wrap.getBoundingClientRect();
        if (!r.width) return;
        coupe.setSize(Math.round(r.width), Math.round(r.height));
      };
      fitGlass();
      ro = new ResizeObserver(fitGlass);
      ro.observe(wrap);
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "300px 0px" });
      io.observe(stage);
      ioGlass = new IntersectionObserver(([e]) => { glassVisible = e.isIntersecting; }, { rootMargin: "160px 0px" });
      ioGlass.observe(wrap);

      onMove = (e) => {
        S.pointerTarget = (e.clientX / window.innerWidth - 0.5) * 2;
        S.py = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      if (!reduced && window.matchMedia("(pointer: fine)").matches) window.addEventListener("pointermove", onMove, { passive: true });

      const frame = (now) => {
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        const dt = Math.min(0.05, (now - S.last) / 1000);
        S.last = now;
        S.t += dt;
        const vh = window.innerHeight;
        const sRect = stage.getBoundingClientRect();
        const gRect = wrap.getBoundingClientRect();

        // scroll-linked state, read from where the glass actually is on screen
        const gc = gRect.top + gRect.height * 0.5;
        const fillScroll = smooth(vh * 1.0, vh * 0.42, gc);
        const tailScroll = smooth(vh * 0.2, -vh * 0.12, gc);
        S.fill += ((reduced ? 1 : fillScroll) - S.fill) * Math.min(1, dt * 7);
        const heroP = clamp(-sRect.top / (vh * 0.9), 0, 1);
        S.tilt += ((reduced ? 0 : heroP) - S.tilt) * Math.min(1, dt * 6);

        // hand: scroll tilt + pointer parallax. The tilt pivots about the wrist, and the spout is
        // pulled back onto the vertical so the stream still falls straight.
        S.pointer += (S.pointerTarget - S.pointer) * Math.min(1, dt * 3);
        if (!reduced && S.introOn) {
          const th = -4.2 * S.tilt;
          const r = th * Math.PI / 180;
          const W = handRef.current.offsetWidth, Hh = handRef.current.offsetHeight;
          const vx = (H.anchor.x - 0.94) * W, vy = (H.anchor.y - 0.08) * Hh;
          const dx = (Math.cos(r) - 1) * vx - Math.sin(r) * vy;
          gsap.set(inner, { rotation: th, x: -dx + S.pointer * 10, y: S.py * 5 - S.tilt * 6, transformOrigin: "94% 8%" });
        }

        // ends of the stream, in stage coordinates
        const aR = anchor.getBoundingClientRect();
        const O = { x: aR.left + aR.width / 2 - sRect.left, y: aR.top + aR.height / 2 - sRect.top };
        coupe.setFill(0.035 + S.fill * 0.93);
        const flow = 1 - smooth(0.82, 1, tailScroll) * 0.6;
        if (glassVisible) {
          coupe.update(dt, S.introOn && S.intro > 0.98 && tailScroll < 0.97 ? flow : 0, reduced ? 0 : S.pointer * 0.9);
          coupe.render();
        } else {
          coupe.group.updateMatrixWorld(true); // keep the projection for the stream endpoint; skip the GPU work
        }
        const sp = coupe.surfaceScreen();
        const I = { x: gRect.left - sRect.left + sp.x, y: gRect.top - sRect.top + sp.y };

        if (S.introOn && S.intro < 1) S.intro = Math.min(1, S.intro + (dt * (FAST ? 12 : 1)) / 1.05);
        const head = reduced ? 1 : 1 - Math.pow(1 - S.intro, 2.4);
        const scale = clamp(window.innerWidth / 1440, 0.62, 1.05);
        const M = 80 * scale + Math.abs(I.x - O.x) * 0.5;
        const left = Math.min(O.x, I.x) - M;
        const top = O.y - 14;
        const w = Math.abs(I.x - O.x) + M * 2;
        const h = I.y - O.y + 110 * scale;
        if (h > 20) {
          const qw = Math.ceil(w / 16) * 16, qh = Math.ceil(h / 16) * 16;
          if (Math.abs(qw - S.sizeW) > 8 || Math.abs(qh - S.sizeH) > 24) { stream.resize(qw, qh); S.sizeW = qw; S.sizeH = qh; }
          streamCanvas.style.transform = `translate3d(${left}px, ${top}px, 0)`;
          stream.draw({
            O: { x: O.x - left, y: O.y - top },
            I: { x: I.x - left, y: I.y - top },
            t: S.t, dt, head, tail: reduced ? 0 : tailScroll, flow: S.introOn ? flow : 0, scale,
          });
        }
      };
      raf = requestAnimationFrame(frame);
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ctx.revert();
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      if (ioGlass) ioGlass.disconnect();
      if (onMove) window.removeEventListener("pointermove", onMove);
      if (coupe) coupe.dispose();
    };
  }, []);

  return (
    <section
      className="pour"
      ref={stageRef}
      aria-label="Speed Tin pouring a cocktail"
      style={{ "--ax": H.anchor.x, "--ay": H.anchor.y, "--ar": H.h / H.w }}
    >
      <div className="pour__bg" aria-hidden="true">
        <div className="pour__bg-glow" />
        <i className="bokeh b1" /><i className="bokeh b2" /><i className="bokeh b3" /><i className="bokeh b4" /><i className="bokeh b5" />
      </div>

      <div className="pour__hero">
        <div className="wrap pour__heroInner">
          <div className="pour__copy" ref={copyRef}>
            <p className="eyebrow js-fade">Shake · Serve · Speed</p>
            <h1 className="display pour__title" aria-label={hero.title}>
              <span className="line-mask js-line" aria-hidden="true"><span>The World’s First</span></span>
              <span className="line-mask js-line" aria-hidden="true"><span>One-Handed</span></span>
              <span className="line-mask js-line" aria-hidden="true"><span><em className="serif">Cocktail</em> Shaker</span></span>
            </h1>
            <p className="pour__sub js-fade">{hero.sub}</p>
            <div className="pour__cta js-fade">
              <Link to="/collections/shop" className="btn">Shop Now <Arrow /></Link>
              <Link to="/pages/learn-more" className="btn btn--ghost">Discover SpeedTin</Link>
            </div>
          </div>
        </div>

        <div className="pour__hand" ref={handRef}>
          <div className="pour__handInner" ref={handInnerRef}>
            <img src="/media/hero-hand.webp" width={H.w} height={H.h} alt="A hand tilting a Speed Tin to pour a cocktail" fetchPriority="high" decoding="async" />
            <i className="pour__anchor" ref={anchorRef} aria-hidden="true" />
          </div>
        </div>
        <div className="pour__scroll js-fade" aria-hidden="true"><span>Scroll</span><i /></div>
      </div>

      <div className="pour__glassSec">
        <div className="wrap pour__glassGrid">
          <div className="pour__glassCopy" data-reveal="up">
            <p className="eyebrow">The pour, in one hand</p>
            <h2 className="h2">{difference.lead}</h2>
            <p className="lede">Pour after shaking without separating the tins.</p>
          </div>
          <div className="pour__glassWrap" ref={glassWrapRef}>
            <canvas ref={glassCanvasRef} aria-hidden="true" />
            <div className="pour__glassShadow" aria-hidden="true" />
          </div>
          <ol className="pour__benefits">
            {difference.benefits.map((b, i) => (
              <li key={b} data-reveal="up" data-delay={i * 0.12}>
                <span className="n">0{i + 1}</span>
                <strong>{b}</strong>
                <span className="d">{benefitsCopy[b]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <canvas className="pour__stream" ref={streamRef} aria-hidden="true" />
    </section>
  );
}
