import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, shopProducts } from "../data/products";
import { method, STORE_URL } from "../data/site";
import BuyBox from "../components/BuyBox";
import ProductCard from "../components/ProductCard";
import YouTubeEmbed from "../components/YouTubeEmbed";
import NotFound from "./NotFound";
import { useMeta } from "../hooks/useMeta";
import { Arrow, Chevron } from "../components/Icons";

function Gallery({ product }) {
  const slides = useMemo(() => {
    const s = [];
    if (product.cutout) s.push({ src: product.cutout, kind: "cut" });
    product.gallery.forEach((g) => s.push({ src: g, kind: "photo" }));
    return s;
  }, [product]);
  const [i, setI] = useState(0);
  const cur = slides[i] || slides[0];
  const go = (d) => setI((v) => (v + d + slides.length) % slides.length);
  return (
    <div className="gal">
      <div className={`gal__stage gal__stage--${cur?.kind}`}>
        {cur && <img key={cur.src} src={cur.src} alt={`${product.title}, image ${i + 1} of ${slides.length}`} fetchPriority={i === 0 ? "high" : "auto"} />}
        {slides.length > 1 && (
          <div className="gal__arrows">
            <button onClick={() => go(-1)} aria-label="Previous image"><Chevron dir="left" /></button>
            <button onClick={() => go(1)} aria-label="Next image"><Chevron dir="right" /></button>
          </div>
        )}
        {product.discount > 0 && <span className="pcard__badge">−{product.discount}%</span>}
      </div>
      {slides.length > 1 && (
        <ul className="gal__thumbs" aria-label="Product images">
          {slides.map((s, k) => (
            <li key={s.src}>
              <button className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Show image ${k + 1}`} aria-current={k === i}>
                <img src={s.src} alt="" loading="lazy" className={s.kind} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Product() {
  const { handle } = useParams();
  const p = getProduct(handle);
  const url = `${STORE_URL}/products/${handle}`;
  const ld = useMemo(() => p && ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.lead,
    image: (p.cutout ? [p.cutout] : []).concat(p.gallery).map((g) => new URL(g, window.location.origin).href),
    brand: { "@type": "Brand", name: "Speed Tin" },
    offers: { "@type": "Offer", priceCurrency: "USD", price: String(p.price), url, availability: p.anyAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
  }), [p, url]);
  useMeta(p?.title, p?.lead, ld);
  if (!p) return <NotFound />;

  const isShaker = !!p.inBox;
  const related = shopProducts.filter((x) => x.handle !== p.handle).slice(0, 3);
  const compare = p.compare && getProduct(p.compare);

  return (
    <>
      <section className="pdp">
        <div className="wrap pdp__grid">
          <Gallery product={p} key={p.handle} />
          <div className="pdp__info">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link><span>/</span><Link to="/collections/shop">Shop</Link><span>/</span><span aria-current="page">{p.short}</span>
            </nav>
            <p className="eyebrow">{p.size}</p>
            <h1 className="pdp__title">{p.title}</h1>
            {p.tagline && <p className="pdp__tag serif">{p.tagline}</p>}
            <p className="lede">{p.lead}</p>
            {p.saving && <p className="pdp__save">{p.saving}</p>}
            <BuyBox product={p} />
            {p.purchaseNote && <p className="pdp__note">{p.purchaseNote}</p>}
            {p.useNote && <p className="pdp__note pdp__note--warn">{p.useNote}</p>}
            <ul className="pdp__links">
              <li><a href={`${STORE_URL}/policies/shipping-policy`}>Shipping</a></li>
              <li><a href={`${STORE_URL}/policies/refund-policy`}>Returns</a></li>
              <li><Link to="/pages/contact-us">Product support</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pdp2 on-light">
        {p.tutorial && (
          <div className="wrap pdp2__row">
            <div className="pdp2__copy">
              <p className="eyebrow">See how Speed Tin works</p>
              <h2 className="h2">{p.tutorialTitle || <>A closer look at the <span className="serif">finger grip</span>, quick-pour mechanism and built-in strainer.</>}</h2>
              <Link to="/pages/learn-more" className="link-u">Setup and cleaning tutorials <Arrow /></Link>
            </div>
            <YouTubeEmbed id={p.tutorial} title={p.tutorialTitle || "Speed Tin tutorial"} />
          </div>
        )}

        {isShaker && (
          <div className="wrap pdp2__row pdp2__row--box">
            <figure className="pdp2__anatomy"><img src="/media/anatomy.webp" width="1024" height="683" alt="What is in the box: Speed Tin, base tin, long and short grips, instructions manual, sticker and matte-finish box" loading="lazy" /></figure>
            <div className="pdp2__copy">
              <p className="eyebrow">{p.handle.startsWith("the-set") ? "What is in the Set?" : "What is in the box?"}</p>
              <h2 className="h2">{p.handle.startsWith("the-set") ? "Two complete Speed Tin shakers, one in each size." : `One complete ${p.short}, including:`}</h2>
              <ul className="ticks">{p.inBox.map((x) => (<li key={x}>{x}</li>))}</ul>
              <p className="muted">{p.inBoxNote}</p>
            </div>
          </div>
        )}

        {isShaker && (
          <div className="wrap pdp2__method">
            <h2 className="h2">From shaking to pouring, <span className="serif">without breaking the tins apart.</span></h2>
            <ol>
              {method.map((m) => (<li key={m.n}><span>{m.n}</span><h3 className="h3">{m.title}</h3><p>{m.copy}</p></li>))}
            </ol>
          </div>
        )}

        {isShaker && (
          <div className="wrap pdp2__size">
            <h2 className="h2">{p.handle.startsWith("the-set") ? "Two sizes, ready for different drinks" : `Is the ${p.short.replace("Speed Tin ", "")} right for you?`}</h2>
            <p className="lede">{p.sizeNote}</p>
            <div className="pdp2__compare">
              {[getProduct("2-0-stainless-steel"), getProduct("standard-stainless-steel")].map((x) => (
                <Link key={x.handle} to={`/products/${x.handle}`} className={x.handle === p.handle ? "is-here" : ""}>
                  <span className="img"><img src={x.cutout} alt="" loading="lazy" /></span>
                  <strong>{x.short} · {x.handle.startsWith("2-0") ? "16oz" : "28oz"}</strong>
                  <em>{x.handle.startsWith("2-0") ? "The smaller model, with a 16oz base tin included. A compact option for single-cocktail preparation." : "The larger model, supplied complete with its 28oz stainless steel base tin."}</em>
                  <span className="link-u">{x.handle === p.handle ? "You are here" : `Compare the ${x.handle.startsWith("2-0") ? "16oz" : "28oz"} model`} {x.handle !== p.handle && <Arrow />}</span>
                </Link>
              ))}
            </div>
            <p className="muted">Tin size is not finished-drink volume. Your recipe and the amount of ice affect how much you can shake.</p>
          </div>
        )}

        {p.faq && (
          <div className="wrap pdp2__faq">
            <h2 className="h2">A few things to know before ordering</h2>
            <div>
              {p.faq.map(([q, a]) => (
                <details key={q}><summary>{q}<Chevron /></summary><p>{a}</p></details>
              ))}
              <details>
                <summary>Shipping, returns and help<Chevron /></summary>
                <p>Shipping is calculated at checkout. See the <a href={`${STORE_URL}/policies/shipping-policy`}>shipping policy</a> for destinations and international-order details.</p>
                <p>Returns are for unused products, subject to the <a href={`${STORE_URL}/policies/refund-policy`}>return policy</a>.</p>
                <p>Have a question about fit, setup or cleaning? <Link to="/pages/contact-us">Get in touch before ordering.</Link></p>
              </details>
            </div>
          </div>
        )}
      </section>

      <section className="pdp3 on-light">
        <div className="wrap">
          <h2 className="h2">More from Speed Tin</h2>
          <div className="pdp3__grid">
            {related.map((r) => (<ProductCard key={r.handle} product={r} />))}
          </div>
        </div>
      </section>
    </>
  );
}
