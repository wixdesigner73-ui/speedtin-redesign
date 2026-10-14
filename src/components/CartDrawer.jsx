import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money } from "../lib/format";
import { Arrow, Close, Minus, Plus } from "./Icons";
import { lockScroll } from "../lib/motion";

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove, checkoutUrl, count } = useCart();
  const panel = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    lockScroll(open);
    if (open) {
      lastFocus.current = document.activeElement;
      setTimeout(() => panel.current?.querySelector("button, a")?.focus(), 60);
    } else if (lastFocus.current) {
      lastFocus.current.focus?.();
    }
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = [...panel.current.querySelectorAll("button, a[href], input")].filter((x) => !x.disabled);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={`drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="drawer__scrim" onClick={() => setOpen(false)} />
      <aside className="drawer__panel" ref={panel} role="dialog" aria-modal="true" aria-label="Shopping cart">
        <header className="drawer__head">
          <h2 className="h3">Your cart <span>{count > 0 ? `(${count})` : ""}</span></h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close cart"><Close /></button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p className="h3">Your cart is empty.</p>
            <p className="lede">Level up your bartending speed and efficiency with Speed Tin.</p>
            <Link to="/collections/shop" className="btn" onClick={() => setOpen(false)}>Shop Speed Tin <Arrow /></Link>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {lines.map((l) => (
                <li key={l.variantId} className="line">
                  <Link to={`/products/${l.handle}`} className="line__img" onClick={() => setOpen(false)}>
                    {l.image && <img src={l.image} alt="" />}
                  </Link>
                  <div className="line__info">
                    <Link to={`/products/${l.handle}`} className="line__title" onClick={() => setOpen(false)}>{l.title}</Link>
                    {l.variantTitle && <span className="line__variant">{l.variantTitle}</span>}
                    <div className="qty qty--sm" role="group" aria-label={`Quantity for ${l.title}`}>
                      <button onClick={() => (l.qty > 1 ? setQty(l.variantId, l.qty - 1) : remove(l.variantId))} aria-label="Decrease quantity"><Minus /></button>
                      <output aria-live="polite">{l.qty}</output>
                      <button onClick={() => setQty(l.variantId, l.qty + 1)} aria-label="Increase quantity"><Plus /></button>
                    </div>
                  </div>
                  <div className="line__price">
                    <strong>{money(l.price * l.qty)}</strong>
                    <button className="line__remove" onClick={() => remove(l.variantId)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="drawer__foot">
              <div className="drawer__sub"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              <p className="drawer__note">Shipping calculated at checkout.</p>
              <a className="btn drawer__checkout" href={checkoutUrl}>Checkout <Arrow /></a>
              <p className="drawer__fine">Checkout is completed securely on speedtin.com.</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
