import { Link } from "react-router-dom";
import { bars } from "../data/site";
import { barsProducts } from "../data/products";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";
import Testimonials from "../components/Testimonials";
import Social from "../components/Social";
import { Arrow } from "../components/Icons";
import { useMeta } from "../hooks/useMeta";

export default function Bars() {
  useMeta("Bars & Restaurants", bars.lead);
  const [b1, b2] = bars.blocks;
  return (
    <>
      <PageHero eyebrow="Bars & Restaurants" title={bars.title} lede={bars.lead} image="/media/bar-duo.webp" />

      <section className="bars on-light">
        <div className="wrap bars__bundles">
          {barsProducts.map((p) => (<ProductCard key={p.handle} product={p} />))}
        </div>

        <div className="wrap bars__blocks">
          <article className="bars__block">
            <img src="/media/bar-pour-solo.webp" alt="" loading="lazy" />
            <div>
              <h2 className="h2">{b1.title}</h2>
              <p className="lede">{b1.copy}</p>
              <Link to={b1.cta.to} className="link-u">{b1.cta.label} <Arrow /></Link>
            </div>
          </article>
          <article className="bars__block bars__block--r">
            <img src="/media/products-six.webp" alt="" loading="lazy" />
            <div>
              <h2 className="h2">{b2.title}</h2>
              <p className="lede">{b2.copy}</p>
              <Link to={b2.cta.to} className="link-u">{b2.cta.label} <Arrow /></Link>
            </div>
          </article>
        </div>

        <div className="wrap bars__trust">
          <p className="eyebrow">{bars.trustedTitle}</p>
          <p className="h2">{bars.trusted}</p>
        </div>
      </section>

      <Testimonials />
      <Social />

      <section className="bars__multi">
        <div className="wrap">
          <p className="display">{bars.multi}</p>
          <Link to="/pages/contact-us" className="btn btn--lg">Contact <Arrow /></Link>
        </div>
      </section>
    </>
  );
}
