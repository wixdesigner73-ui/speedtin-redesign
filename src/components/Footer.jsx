import { Link } from "react-router-dom";
import { footerNav, policies, social, closing } from "../data/site";
import { shopifyPaths } from "../lib/shopify";
import { Arrow } from "./Icons";

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr__top">
        <div className="ftr__brand">
          <img src="/media/logo-white.webp" width="405" height="185" alt="Speed Tin" loading="lazy" />
          <p className="ftr__tag">Shake <i>·</i> Serve <i>·</i> Speed</p>
        </div>

        <nav className="ftr__nav" aria-label="Footer">
          <h2 className="eyebrow">Explore</h2>
          <ul>
            {footerNav.map((n) => (<li key={n.label}><Link to={n.to}>{n.label}</Link></li>))}
          </ul>
        </nav>

        <div className="ftr__nav">
          <h2 className="eyebrow">Follow</h2>
          <ul>
            {social.map((s) => (<li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>))}
          </ul>
          <h2 className="eyebrow" style={{ marginTop: 28 }}>Policies</h2>
          <ul>
            {policies.map((s) => (<li key={s.label}><a href={s.href}>{s.label}</a></li>))}
          </ul>
        </div>

        <div className="ftr__news">
          <h2 className="eyebrow">Newsletter</h2>
          <p className="ftr__newsHead">{closing.headline}</p>
          {/* Posts to the live Shopify store's customer form, the same endpoint the current site uses. */}
          <form method="post" action={shopifyPaths.contactForm} acceptCharset="UTF-8" className="news">
            <input type="hidden" name="form_type" value="customer" />
            <input type="hidden" name="utf8" value="✓" />
            <input type="hidden" name="contact[tags]" value="newsletter" />
            <label htmlFor="ftr-email" className="sr-only">Email</label>
            <input id="ftr-email" type="email" name="contact[email]" placeholder="Enter your email" required autoComplete="email" spellCheck="false" />
            <button type="submit" aria-label="Subscribe"><span>Subscribe</span><Arrow /></button>
          </form>
        </div>
      </div>
      <div className="wrap ftr__bar">
        <span>© {new Date().getFullYear()} Speed Tin</span>
        <span>USD · Shipping calculated at checkout</span>
      </div>
    </footer>
  );
}
