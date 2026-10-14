import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import { difference } from "../data/site";
import { prefersReducedMotion } from "../lib/format";

// Callouts. Every line of copy is from the live product pages (Standard 28oz).
// `at` is the hotspot as a fraction of the product image; `side` is where the label sits.
const CALLOUTS = [
  { n: "01", side: "l", y: 17, at: [0.2, 0.3], title: "Built-in strainer", copy: "Pour through the built-in strainer without separating the tins." },
  { n: "02", side: "r", y: 11, at: [0.66, 0.09], title: "Three finger grips", copy: "Short, Standard and Long finger grips are included." },
  { n: "03", side: "r", y: 37, at: [0.74, 0.22], title: "Quick-pour mechanism", copy: "Use the finger grip to open the quick-pour mechanism." },
  { n: "04", side: "l", y: 46, at: [0.32, 0.62], title: "Stainless steel base tin", copy: "Supplied complete with its 28oz stainless steel base tin." },
];

// Stage is a fixed 1.9:1 box on desktop; the product is 92% of its height, centred.
const ASPECT = 1.9, PROD_H = 92, PROD_TOP = 3, IMG_RATIO = 557 / 1269;
const prodW = ((PROD_H / 100) * (1 / ASPECT) * IMG_RATIO) * 100; // in % of stage width
const hot = ([fx, fy]) => ({ x: 50 + (fx - 0.5) * prodW, y: PROD_TOP + fy * PROD_H });

export default function Difference() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const layers = root.current.querySelectorAll("[data-depth]");
    const setters = [...layers].map((l) => ({
      d: parseFloat(l.dataset.depth),
      x: gsap.quickTo(l, "x", { duration: 1.1, ease: "power3.out" }),
      y: gsap.quickTo(l, "y", { duration: 1.1, ease: "power3.out" }),
    }));
    const stage = root.current.querySelector(".diff__stage");
    const move = (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / r.width;
      const py = (e.clientY - (r.top + r.height / 2)) / r.height;
      setters.forEach(({ d, x, y }) => { x(px * d * 900); y(py * d * 600); });
    };
    const leave = () => setters.forEach(({ x, y }) => { x(0); y(0); });
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", leave);
    return () => { stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <section className="diff" ref={root} aria-labelledby="diff-h">
      <div className="wrap diff__head">
        <p className="eyebrow" data-reveal="up">The Speed Tin difference</p>
        <h2 id="diff-h" className="h2 diff__title" data-reveal="up" data-delay="0.08">{difference.title}</h2>
      </div>

      <div className="wrap diff__wrap">
        <div className="diff__stage">
          {/* floating, depth-sorted props (pre-rendered from the same glass materials as the hero glass) */}
          <img className="fx fx-ice1" data-depth="0.05" src="/media/fx/ice-1.webp" alt="" loading="lazy" />
          <img className="fx fx-ice2" data-depth="0.085" src="/media/fx/ice-2.webp" alt="" loading="lazy" />
          <img className="fx fx-ice3" data-depth="0.16" src="/media/fx/ice-3.webp" alt="" loading="lazy" />
          <img className="fx fx-peel" data-depth="0.07" src="/media/fx/peel.webp" alt="" loading="lazy" />
          <img className="fx fx-lime" data-depth="0.1" src="/media/fx/lime.webp" alt="" loading="lazy" />
          <img className="fx fx-drop d1" data-depth="0.09" src="/media/fx/drop.webp" alt="" loading="lazy" />
          <img className="fx fx-drop d2" data-depth="0.06" src="/media/fx/drop.webp" alt="" loading="lazy" />
          <img className="fx fx-drop d3" data-depth="0.13" src="/media/fx/drop.webp" alt="" loading="lazy" />

          <div className="diff__product" data-depth="0.012" style={{ "--w": `${prodW}%`, "--h": `${PROD_H}%`, "--t": `${PROD_TOP}%` }}>
            <img src="/media/cut-standard.webp" width="557" height="1269" alt="Speed Tin Standard, 28oz stainless steel one-handed cocktail shaker" loading="lazy" data-reveal="scale" />
            {CALLOUTS.map((c) => (
              <i key={c.n} className="diff__dot" style={{ left: `${c.at[0] * 100}%`, top: `${c.at[1] * 100}%` }} aria-hidden="true"><b>{c.n}</b></i>
            ))}
          </div>
          <div className="diff__shadow" aria-hidden="true" />

          {/* connector lines */}
          <svg className="diff__lines" viewBox="0 0 1000 526" preserveAspectRatio="none" aria-hidden="true">
            {CALLOUTS.map((c) => {
              const h = hot(c.at);
              const x1 = c.side === "l" ? 300 : 700, y1 = (c.y + 5) * 5.26;
              const hx = h.x * 10, hy = h.y * 5.26;
              const mid = c.side === "l" ? x1 + (hx - x1) * 0.42 : x1 - (x1 - hx) * 0.42;
              return <path key={c.n} d={`M${x1} ${y1} H${mid} L${hx} ${hy}`} />;
            })}
          </svg>

          {CALLOUTS.map((c, i) => (
            <div key={c.n} className={`diff__label ${c.side === "l" ? "is-l" : "is-r"}`} style={{ top: `${c.y}%` }} data-reveal={c.side === "l" ? "left" : "right"} data-delay={0.1 + i * 0.1}>
              <span className="n">{c.n}</span>
              <strong>{c.title}</strong>
              <p>{c.copy}</p>
            </div>
          ))}
        </div>

        {/* phones & tablets: the callouts become a clean list under the product */}
        <ol className="diff__list">
          {CALLOUTS.map((c) => (
            <li key={c.n}><span className="n">{c.n}</span><div><strong>{c.title}</strong><p>{c.copy}</p></div></li>
          ))}
        </ol>
      </div>

      <div className="wrap diff__foot">
        <p className="diff__line" data-reveal="up"><span className="serif">Shake.</span> Strain. Pour. <span className="serif">One hand.</span></p>
        <div className="diff__chips" data-reveal="up" data-delay="0.1">
          {difference.benefits.map((b) => (<span key={b}>{b}</span>))}
        </div>
      </div>
    </section>
  );
}
