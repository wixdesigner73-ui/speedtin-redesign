import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../lib/motion";
import { closing } from "../data/site";
import { prefersReducedMotion } from "../lib/format";
import { Arrow } from "./Icons";

export default function FinalCTA() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const layers = [...root.current.querySelectorAll("[data-depth]")].map((l) => ({
      d: parseFloat(l.dataset.depth),
      x: gsap.quickTo(l, "x", { duration: 1.2, ease: "power3.out" }),
      y: gsap.quickTo(l, "y", { duration: 1.2, ease: "power3.out" }),
    }));
    const move = (e) => {
      const r = root.current.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / r.width, py = (e.clientY - (r.top + r.height / 2)) / r.height;
      layers.forEach(({ d, x, y }) => { x(px * d * 800); y(py * d * 500); });
    };
    const el = root.current;
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return (
    <section className="cta" ref={root} aria-labelledby="cta-h">
      <div className="cta__glow" aria-hidden="true" />
      <div className="cta__stage" aria-hidden="true">
        <img className="fx fx-ice1" data-depth="0.07" src="/media/fx/ice-2.webp" alt="" loading="lazy" />
        <img className="fx fx-ice2" data-depth="0.12" src="/media/fx/ice-3.webp" alt="" loading="lazy" />
        <img className="fx fx-ice3" data-depth="0.2" src="/media/fx/ice-1.webp" alt="" loading="lazy" />
        <img className="fx fx-lemon" data-depth="0.1" src="/media/fx/lemon.webp" alt="" loading="lazy" />
        <img className="fx fx-lime" data-depth="0.15" src="/media/fx/lime.webp" alt="" loading="lazy" />
        <img className="fx fx-peel" data-depth="0.09" src="/media/fx/peel.webp" alt="" loading="lazy" />
        <img className="fx fx-drop d1" data-depth="0.11" src="/media/fx/drop.webp" alt="" loading="lazy" />
        <img className="fx fx-drop d2" data-depth="0.16" src="/media/fx/drop.webp" alt="" loading="lazy" />
        <img className="fx fx-drop d3" data-depth="0.07" src="/media/fx/drop.webp" alt="" loading="lazy" />
        <div className="cta__product" data-depth="0.02">
          <img src="/media/cut-set.webp" width="678" height="791" alt="" loading="lazy" data-reveal="scale" />
          <span className="cta__shadow" />
        </div>
      </div>

      <div className="wrap cta__copy">
        <p className="eyebrow" data-reveal="up">The Set · One Standard, one 2.0</p>
        <h2 id="cta-h" className="display" data-reveal="up" data-delay="0.08">
          Level up your <span className="serif">bartending</span> speed and efficiency with Speedtin
        </h2>
        <div className="cta__row" data-reveal="up" data-delay="0.2">
          <Link to="/collections/shop" className="btn btn--lg">Shop Now <Arrow /></Link>
          <Link to="/products/the-set-1-standard-speed-tin-1-2-0-speed-tin" className="btn btn--ghost btn--lg">See The Set</Link>
        </div>
      </div>
    </section>
  );
}
