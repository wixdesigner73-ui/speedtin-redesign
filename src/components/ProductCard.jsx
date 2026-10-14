import { useRef } from "react";
import { Link } from "react-router-dom";
import { AddButton, Price, Swatches, useVariant } from "./BuyBox";
import { Arrow } from "./Icons";

// Large editorial product card. The hover state is pointer-driven (tilt, light, shadow); on touch
// devices the same information is simply always visible (see the (hover: none) rules in CSS).
export default function ProductCard({ product, className = "", variantLayout = "" }) {
  const { variant, setId } = useVariant(product);
  const el = useRef(null);
  const fine = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const move = (e) => {
    if (!fine) return;
    const r = el.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const s = el.current.style;
    s.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    s.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    s.setProperty("--ry", `${((x - 0.5) * 9).toFixed(2)}deg`);
    s.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
  };
  const leave = () => {
    const s = el.current.style;
    ["--mx", "--my", "--ry", "--rx"].forEach((k) => s.removeProperty(k));
  };

  const isPhoto = !!product.photo;
  return (
    <article className={`pcard pcard--${product.card.tone} ${className} ${variantLayout}`} ref={el} onPointerMove={move} onPointerLeave={leave}>
      <Link to={`/products/${product.handle}`} className="pcard__media" aria-label={`${product.short}, view details`}>
        <span className="pcard__light" aria-hidden="true" />
        {isPhoto ? (
          <img className="pcard__photo" src={product.photo} alt="" loading="lazy" decoding="async" />
        ) : (
          <>
            <img className="pcard__img" src={product.cutout} alt={`${product.short}, ${product.size}`} loading="lazy" decoding="async" />
            <span className="pcard__shadow" aria-hidden="true" />
          </>
        )}
        {product.discount > 0 && <span className="pcard__badge">−{product.discount}%</span>}
        <span className="pcard__peek" aria-hidden="true">View details <Arrow /></span>
      </Link>

      <div className="pcard__body">
        <div className="pcard__text">
          <p className="pcard__kicker">{product.size}</p>
          <h3 className="pcard__title"><Link to={`/products/${product.handle}`}>{product.short}</Link></h3>
          <p className="pcard__blurb">{product.card.blurb}</p>
        </div>
        <div className="pcard__buy">
          <Price product={product} variant={product.hasVariants ? variant : null} />
          {product.hasVariants && <Swatches product={product} variant={variant} setId={setId} size="sm" />}
          <AddButton product={product} variant={variant} />
        </div>
      </div>
    </article>
  );
}
