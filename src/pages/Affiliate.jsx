import { Link } from "react-router-dom";
import { affiliate, affiliateSignupUrl } from "../data/site";
import { pour } from "../data/heroArt";
import PageHero from "../components/PageHero";
import { Arrow } from "../components/Icons";
import { useMeta } from "../hooks/useMeta";

export default function Affiliate() {
  useMeta("Affiliate Program", affiliate.lead);
  return (
    <>
      <PageHero eyebrow="Affiliate" title={affiliate.title} lede={affiliate.lead} image="/media/bar-pour-trio.webp" art={pour}>
        <a href={affiliateSignupUrl} className="btn" target="_blank" rel="noopener noreferrer">Become an Affiliate <Arrow /></a>
      </PageHero>
      <section className="aff on-light">
        <div className="wrap aff__grid">
          <figure className="aff__img" data-reveal="img"><img src="/media/bar-duo.webp" alt="Two bartenders pouring with Speed Tins" loading="lazy" /></figure>
          <div>
            <p className="eyebrow" data-reveal="up">Affiliate Program</p>
            <h2 className="h2" data-reveal="up" data-delay="0.06">{affiliate.whyTitle}</h2>
            <p className="lede" data-reveal="up" data-delay="0.12">{affiliate.why}</p>
            <div className="aff__cta" data-reveal="up" data-delay="0.18">
              <a href={affiliateSignupUrl} className="btn btn--dark" target="_blank" rel="noopener noreferrer">Become an Affiliate <Arrow /></a>
              <Link to="/pages/about-us" className="link-u">Learn Our Story <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
