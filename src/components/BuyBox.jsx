import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { money } from "../lib/format";
import { Check, Minus, Plus, Arrow } from "./Icons";

// One place for variant selection, quantity and add-to-cart so the home cards, shop grid and
// product page all behave identically (including sold-out variants such as the grips).
export function useVariant(product) {
  const firstAvailable = product.variants.find((v) => v.available) || product.variants[0];
  const [id, setId] = useState(firstAvailable.id);
  const variant = product.variants.find((v) => v.id === id) || firstAvailable;
  return { variant, setId };
}

export function Swatches({ product, variant, setId, size = "md" }) {
  const sw = product.swatches || {};
  const label = product.options[0]?.name || "Option";
  return (
    <div className={`swatches swatches--${size}`} role="radiogroup" aria-label={label}>
      {product.variants.map((v) => (
        <button
          key={v.id}
          type="button"
          role="radio"
          aria-checked={v.id === variant.id}
          aria-label={`${v.title}${v.available ? "" : ", sold out"}`}
          title={`${v.title}${v.available ? "" : " (sold out)"}`}
          className={`sw ${v.id === variant.id ? "is-on" : ""} ${v.available ? "" : "is-out"}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setId(v.id); }}
          style={{ "--c": sw[v.title] || "var(--silver)" }}
        >
          <i />
        </button>
      ))}
      <span className="swatches__name">{variant.title}{variant.available ? "" : " · Sold out"}</span>
    </div>
  );
}

export function Price({ product, variant, large = false }) {
  const price = variant ? variant.price : product.price;
  const compare = variant ? (variant.compareAt && variant.compareAt > variant.price ? variant.compareAt : null) : product.compareAt;
  return (
    <p className={`price ${large ? "price--lg" : ""}`}>
      <strong>{money(price)}</strong>
      {compare && <s aria-label={`Regular price ${money(compare)}`}>{money(compare)}</s>}
      {compare && <span className="price__off">Save {Math.floor((1 - price / compare) * 100 + 1e-6)}%</span>}
    </p>
  );
}

export function AddButton({ product, variant, qty = 1, size = "sm", className = "" }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1800);
    return () => clearTimeout(t);
  }, [done]);
  const out = !variant.available;
  return (
    <button
      type="button"
      className={`btn ${size === "sm" ? "btn--sm" : ""} add-btn ${done ? "is-done" : ""} ${className}`}
      disabled={out}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); add(product, variant, qty); setDone(true); }}
    >
      <span className="add-btn__a">{out ? "Sold out" : "Add to Cart"} {!out && <Arrow />}</span>
      <span className="add-btn__b" aria-hidden="true"><Check /> Added</span>
    </button>
  );
}

export default function BuyBox({ product }) {
  const { variant, setId } = useVariant(product);
  const [qty, setQty] = useState(1);
  return (
    <div className="buybox">
      <Price product={product} variant={variant} large />
      <p className="buybox__ship">Shipping calculated at checkout.</p>
      {product.hasVariants && <Swatches product={product} variant={variant} setId={setId} />}
      <div className="buybox__row">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus /></button>
          <output aria-live="polite">{qty}</output>
          <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity"><Plus /></button>
        </div>
        <AddButton product={product} variant={variant} qty={qty} size="lg" className="buybox__add" />
      </div>
    </div>
  );
}
