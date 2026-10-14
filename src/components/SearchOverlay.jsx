import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchProducts, shopProducts } from "../data/products";
import { money } from "../lib/format";
import { Arrow, Close, Search } from "./Icons";
import { lockScroll } from "../lib/motion";

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState("");
  const input = useRef(null);
  const nav = useNavigate();
  const results = q ? searchProducts(q) : [];

  useEffect(() => {
    lockScroll(open);
    if (open) setTimeout(() => input.current?.focus(), 80);
    else setQ("");
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    onClose();
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const list = q ? results : shopProducts.slice(0, 3);

  return (
    <div className={`search ${open ? "is-open" : ""}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Search">
      <div className="search__scrim" onClick={onClose} />
      <div className="search__panel">
        <form className="search__form" onSubmit={submit} role="search">
          <Search />
          <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Speed Tin" aria-label="Search products" autoComplete="off" />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search"><Close /></button>
        </form>
        <p className="eyebrow search__label">{q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular"}</p>
        <ul className="search__list">
          {list.map((p) => (
            <li key={p.handle}>
              <Link to={`/products/${p.handle}`} onClick={onClose} tabIndex={open ? 0 : -1}>
                <span className="search__img">{(p.cutout || p.photo) && <img src={p.cutout || p.photo} alt="" />}</span>
                <span className="search__t"><strong>{p.short}</strong><em>{p.size}</em></span>
                <span className="search__p">{money(p.price)}</span>
              </Link>
            </li>
          ))}
          {q && results.length === 0 && <li className="search__none">Nothing found for “{q}”. Try “shaker”, “grips” or “bundle”.</li>}
        </ul>
        {q && <button className="link-u" onClick={submit}>See all results <Arrow /></button>}
      </div>
    </div>
  );
}
