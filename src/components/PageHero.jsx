import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import { prefersReducedMotion } from "../lib/format";
import manifest from "../../public/media/manifest.json";

const HAND = manifest["hero-hand"];

/**
 * Cinematic inner-page hero, the same language as the home page.
 *   art = { type: "pour" }                      the real hand + Speed Tin with the live ruby stream
 *   art = { type: "items", items: [...] }       floating product cutouts + ice / citrus sprites, mouse parallax
 *     item: { src, x, y, w (all % of the art box), r (deg), d (parallax depth), blur, z }
 */
export default function PageHero({ eyebrow, title, lede, image, children, art, align = "left", compact = false }) {
  const root = useRef(null);
  const handInner = useRef(null);
  const anchor = useRef(null);
  const streamRef = useRef(null);
  const kind = art?.type;

  useEffect(() => {
    const el = root.current;
    const reduced = prefersReducedMotion();
    let raf = 0, io, ro, disposed = false, onMove;
    const S = { head: reduced ? 1 : 0, started: reduced, t: 0, last: performance.now(), visible: true, w: 0, h: 0 };

    const ctx = gsap.context(() => {
      const copy = el.querySelectorAll(".js-in");
      const mask = el.querySelector(".phero__title > span");
      if (reduced) { gsap.set(copy, { opacity: 1 }); if (mask) gsap.set(mask, { yPercent: 0 }); return; }
      if (mask) gsap.set(mask, { yPercent: 108 });
      gsap.set(copy, { opacity: 0, y: 26 });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
      tl.to(mask, { yPercent: 0, duration: 1.3 }, 0.1)
        .to(copy, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09 }, 0.35);
      if (kind === "pour") {
        gsap.set(handInner.current, { y: -150, x: 80, rotation: 6, opacity: 0, transformOrigin: "94% 8%" });
        tl.to(handInner.current, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 1.8, ease: "expo.out" }, 0.1)
          .call(() => { S.started = true; }, null, 1.1);
      }
      if (kind === "items") {
        const items = el.querySelectorAll(".phero__item");
        gsap.set(items, { opacity: 0, y: 60, scale: 0.94 });
        tl.to(items, { opacity: 1, y: 0, scale: 1, duration: 1.6, stagger: 0.09, ease: "expo.out" }, 0.25);
      }
    }, el);

    // mouse parallax for floating items
    if (kind === "items" && !reduced && window.matchMedia("(pointer: fine)").matches) {
      const setters = [...el.querySelectorAll("[data-depth]")].map((l) => ({
        d: parseFloat(l.dataset.depth),
        x: gsap.quickTo(l, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(l, "y", { duration: 1.1, ease: "power3.out" }),
      }));
      onMove = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - (r.left + r.width / 2)) / r.width, py = (e.clientY - (r.top + r.height / 2)) / r.height;
        setters.forEach(({ d, x, y }) => { x(px * d * 900); y(py * d * 600); });
      };
      el.addEventListener("pointermove", onMove);
    }

    // the live stream, from the real spout to the bottom edge of the hero
    if (kind === "pour") {
      import("../gl/stream").then(({ createStream }) => {
        if (disposed) return;
        const canvas = streamRef.current;
        const stream = createStream(canvas, { reduced });
        io = new IntersectionObserver(([e]) => { S.visible = e.isIntersecting; });
        io.observe(el);
        const frame = (now) => {
          raf = requestAnimationFrame(frame);
          if (!S.visible) return;
          const dt = Math.min(0.05, (now - S.last) / 1000);
          S.last = now; S.t += dt;
          const hr = el.getBoundingClientRect();
          const ar = anchor.current.getBoundingClientRect();
          const O = { x: ar.left + ar.width / 2 - hr.left, y: ar.top + ar.height / 2 - hr.top };
          const I = { x: O.x, y: hr.height + 40 };
          const scale = Math.min(1.05, Math.max(0.62, window.innerWidth / 1440));
          const M = 80 * scale, h = I.y - O.y + 60;
          if (h < 24) { stream.clear(); return; }
          const qw = Math.ceil((M * 2) / 16) * 16, qh = Math.ceil(h / 16) * 16;
          if (Math.abs(qw - S.w) > 8 || Math.abs(qh - S.h) > 24) { stream.resize(qw, qh); S.w = qw; S.h = qh; }
          canvas.style.transform = `translate3d(${O.x - M}px, ${O.y - 14}px, 0)`;
          if (S.started && S.head < 1) S.head = Math.min(1, S.head + dt / 0.9);
          stream.draw({ O: { x: M, y: 14 }, I: { x: M, y: I.y - O.y + 14 }, t: S.t, dt, head: reduced ? 1 : 1 - Math.pow(1 - S.head, 2.4), tail: 0, flow: S.started ? 1 : 0, scale });
        };
        raf = requestAnimationFrame(frame);
      });
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      if (onMove) el.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, [kind]);

  return (
    <header
      ref={root}
      className={`phero ${compact ? "phero--compact" : ""} phero--${align} ${kind ? `phero--${kind}` : ""} ${image ? "has-img" : ""}`}
      style={{ "--ax": HAND.anchor.x, "--ay": HAND.anchor.y, "--ar": HAND.h / HAND.w }}
    >
      <div className="phero__fx" aria-hidden="true">
        <i className="phero__glow" />
        <i className="bokeh b1" /><i className="bokeh b3" /><i className="bokeh b5" />
      </div>
      {image && (
        <div className="phero__bg" aria-hidden="true">
          <img src={image} alt="" decoding="async" fetchPriority="high" />
        </div>
      )}

      <div className="wrap phero__in">
        {eyebrow && <p className="eyebrow js-in">{eyebrow}</p>}
        <h1 className="display phero__title"><span className="line-mask"><span>{title}</span></span></h1>
        {lede && <p className="lede js-in">{lede}</p>}
        {children && <div className="phero__actions js-in">{children}</div>}
      </div>

      {kind === "pour" && (
        <>
          <div className="phero__hand" aria-hidden="true">
            <div className="phero__handInner" ref={handInner}>
              <img src="/media/hero-hand.webp" width={HAND.w} height={HAND.h} alt="" fetchPriority="high" />
              <i className="phero__anchor" ref={anchor} />
            </div>
          </div>
          <canvas className="phero__stream" ref={streamRef} aria-hidden="true" />
        </>
      )}

      {kind === "items" && (
        <div className="phero__art" aria-hidden="true">
          {art.items.map((it, i) => (
            <div key={i} className="phero__item" style={{ left: `${it.x}%`, top: `${it.y}%`, width: `${it.w}%`, zIndex: it.z || 2 }}>
              <img
                data-depth={it.d || 0.04}
                src={it.src}
                alt=""
                loading="eager"
                style={{ transform: `rotate(${it.r || 0}deg)`, filter: it.blur ? `blur(${it.blur}px)` : undefined }}
                className={it.cls || ""}
              />
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
