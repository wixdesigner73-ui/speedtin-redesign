import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { nav, accountUrl } from "../data/site";
import { useCart } from "../context/CartContext";
import { Arrow, Bag, Chevron, Search, User } from "./Icons";
import { lockScroll } from "../lib/motion";
import { getProduct } from "../data/products";
import { social } from "../data/site";
import { money } from "../lib/format";

const priceFor = (to) => { const p = getProduct(to.split("/").pop()); return p ? money(p.price) : null; };

export default function Header({ onSearch }) {
  const { count, setOpen, bump } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [ping, setPing] = useState(false);
  const loc = useLocation();
  const closeT = useRef(0);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => { setMenu(false); setMega(false); }, [loc.pathname]);
  useEffect(() => { lockScroll(menu); return () => lockScroll(false); }, [menu]);
  useEffect(() => {
    if (!bump) return;
    setPing(true);
    const t = setTimeout(() => setPing(false), 700);
    return () => clearTimeout(t);
  }, [bump]);

  const openMega = () => { clearTimeout(closeT.current); setMega(true); };
  const closeMega = () => { closeT.current = setTimeout(() => setMega(false), 120); };
  const shop = nav.find((n) => n.children);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`hdr ${scrolled ? "is-scrolled" : ""} ${menu ? "is-menu" : ""}`}>
        <div className="hdr__bar">
          <Link to="/" className="hdr__logo" aria-label="Speed Tin, home">
            <img src="/media/logo-white.webp" width="405" height="185" alt="Speed Tin" />
          </Link>

          <nav className="hdr__nav" aria-label="Primary">
            {nav.map((n) =>
              n.children ? (
                <div key={n.label} className="hdr__item" onMouseEnter={openMega} onMouseLeave={closeMega} onFocus={openMega} onBlur={closeMega}>
                  <NavLink to={n.to} className="hdr__link" aria-haspopup="true" aria-expanded={mega}>
                    {n.label} <Chevron />
                  </NavLink>
                </div>
              ) : (
                <NavLink key={n.label} to={n.to} end={n.to === "/"} className="hdr__link">{n.label}</NavLink>
              )
            )}
          </nav>

          <div className="hdr__tools">
            <button className="hdr__icon" onClick={onSearch} aria-label="Search"><Search /></button>
            <a className="hdr__icon hdr__acct" href={accountUrl} aria-label="Log in or view your account"><User /></a>
            <button className={`hdr__icon hdr__cart ${ping ? "is-ping" : ""}`} onClick={() => setOpen(true)} aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}>
              <Bag />
              {count > 0 && <span className="hdr__badge">{count}</span>}
            </button>
            <Link to="/collections/shop" className="btn btn--sm hdr__cta">Shop Now <Arrow /></Link>
            <button className="hdr__burger" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Close menu" : "Open menu"}>
              <i /><i />
            </button>
          </div>
        </div>

        <div className={`mega ${mega ? "is-open" : ""}`} onMouseEnter={openMega} onMouseLeave={closeMega} aria-hidden={!mega}>
          <div className="mega__inner">
            <div className="mega__lead">
              <p className="eyebrow">Shop</p>
              <p className="mega__title">Experience the Speed Tin Difference!</p>
              <Link to="/collections/shop" className="link-u" tabIndex={mega ? 0 : -1}>Shop All <Arrow /></Link>
            </div>
            {shop.children.map((c) => (
              <Link key={c.to} to={c.to} className="mega__card" tabIndex={mega ? 0 : -1}>
                <span className="mega__img">{c.img ? <img src={`/media/${c.img}.webp`} alt="" loading="lazy" /> : <img src="/media/grips-bar.webp" alt="" loading="lazy" className="photo" />}</span>
                <strong>{c.label}</strong>
                <em>{c.sub}</em>
                <span className="mega__price">{priceFor(c.to) && <>From {priceFor(c.to)}</>}<Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mmenu ${menu ? "is-open" : ""}`} aria-hidden={!menu}>
        <i className="mmenu__glow" aria-hidden="true" />
        <img className="mmenu__hand" src="/media/hero-hand.webp" alt="" aria-hidden="true" />
        <nav className="mmenu__nav" aria-label="Mobile">
          {nav.map((n, i) => (
            <div key={n.label} style={{ "--i": i }} className="mmenu__row">
              <NavLink to={n.to} end={n.to === "/"} tabIndex={menu ? 0 : -1} className="mmenu__link">
                <span className="mmenu__n">0{i + 1}</span>
                <span className="mmenu__t">{n.label}</span>
                <Arrow />
              </NavLink>
              {n.children && (
                <ul className="mmenu__tiles">
                  {n.children.map((c) => (
                    <li key={c.to}>
                      <Link to={c.to} tabIndex={menu ? 0 : -1}>
                        <span className="mmenu__img"><img src={c.img ? `/media/${c.img}.webp` : "/media/grips-bar.webp"} alt="" className={c.img ? "" : "photo"} loading="lazy" /></span>
                        <strong>{c.label}</strong>
                        <em>{priceFor(c.to) ? `From ${priceFor(c.to)}` : c.sub}</em>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
        <div className="mmenu__foot">
          <div className="mmenu__links">
            <a href={accountUrl} tabIndex={menu ? 0 : -1}>Log in</a>
            {social.map((x) => (<a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer" tabIndex={menu ? 0 : -1}>{x.label}</a>))}
          </div>
          <Link to="/collections/shop" className="btn" tabIndex={menu ? 0 : -1}>Shop Now <Arrow /></Link>
        </div>
      </div>
    </>
  );
}
