import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { testimonials } from "../data/site";
import { getProduct } from "../data/products";
import { Arrow, Chevron } from "./Icons";

// Reviewer names and wording are exactly as published on speedtin.com.
export default function Testimonials() {
  const [i, setI] = useState(0);
  const start = useRef(null);
  const n = testimonials.length;
  const go = (d) => setI((v) => (v + d + n) % n);
  const t = testimonials[i];
  const product = getProduct(t.product);

  const down = (e) => { start.current = e.clientX; };
  const up = (e) => {
    if (start.current == null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <section className="tst" aria-labelledby="tst-h" onPointerDown={down} onPointerUp={up} onPointerCancel={() => (start.current = null)}>
      <span className="tst__mark" aria-hidden="true">&ldquo;</span>
      <div className="wrap tst__inner">
        <p className="eyebrow" data-reveal="up">Trusted by bartenders &amp; bar owners</p>
        <h2 id="tst-h" className="sr-only">Customer testimonials</h2>

        <div className="tst__stage" aria-live="polite">
          <figure key={i} className="tst__slide">
            {t.title && <p className="tst__title">{t.title}</p>}
            <blockquote className="tst__quote">{t.quote}</blockquote>
            <figcaption>
              <span className="tst__name">{t.name}</span>
              <span className="tst__verified">Verified buyer</span>
            </figcaption>
          </figure>
        </div>

        <div className="tst__foot">
          <div className="tst__nav">
            <button onClick={() => go(-1)} aria-label="Previous testimonial"><Chevron dir="left" /></button>
            <span className="tst__count"><b>0{i + 1}</b> / 0{n}</span>
            <button onClick={() => go(1)} aria-label="Next testimonial"><Chevron dir="right" /></button>
          </div>
          <div className="tst__dots" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((x, k) => (
              <button key={x.name} role="tab" aria-selected={k === i} aria-label={`Testimonial ${k + 1}, ${x.name}`} className={k === i ? "on" : ""} onClick={() => setI(k)} />
            ))}
          </div>
          {product && (
            <Link to={`/products/${product.handle}`} className="tst__prod">
              <span className="tst__thumb">{product.cutout && <img src={product.cutout} alt="" />}</span>
              <span><em>Reviewed</em><strong>{product.short}</strong></span>
              <Arrow />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
