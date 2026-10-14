import { Link } from "react-router-dom";
import { audiences, wholesaleTeaser } from "../data/site";
import { Arrow } from "./Icons";

// Three different compositions on purpose: not three identical cards.
const media = {
  home: { src: "/media/home-kitchen.webp", w: 2200, h: 1467, alt: "Pouring a cocktail at home with a Speed Tin" },
  bartenders: { src: "/media/bartender-pour.webp", w: 1800, h: 1979, alt: "A bartender pouring with a Speed Tin" },
  bars: { src: "/media/restaurant.webp", w: 2400, h: 1601, alt: "Bartenders using Speed Tins in a restaurant bar" },
};

export default function Audience() {
  const [home, bartenders, bars] = audiences;
  return (
    <section className="aud" aria-labelledby="aud-h">
      <div className="wrap aud__head">
        <p className="eyebrow" data-reveal="up">Who it&rsquo;s for</p>
        <h2 id="aud-h" className="h2" data-reveal="up" data-delay="0.08">Faster Drink Service. <span className="serif">Happier Customers.</span></h2>
      </div>

      {/* A: image right, copy card overlapping bottom-left */}
      <article className="aud__a wrap">
        <div className="aud__imgA" data-reveal="img">
          <img data-parallax="0.1" src={media.home.src} width={media.home.w} height={media.home.h} alt={media.home.alt} loading="lazy" decoding="async" />
        </div>
        <div className="aud__cardA" data-reveal="up" data-delay="0.1">
          <span className="aud__no">01</span>
          <h3 className="h2">{home.title}</h3>
          <p>{home.copy}</p>
          <Link to={home.cta.to} className="btn">{home.cta.label} <Arrow /></Link>
        </div>
      </article>

      {/* B: tall portrait left, copy right, big numeral */}
      <article className="aud__b wrap">
        <div className="aud__imgB" data-reveal="img">
          <img data-parallax="0.12" src={media.bartenders.src} width={media.bartenders.w} height={media.bartenders.h} alt={media.bartenders.alt} loading="lazy" decoding="async" />
        </div>
        <div className="aud__copyB">
          <span className="aud__big" aria-hidden="true" data-reveal="fade">02</span>
          <h3 className="h2" data-reveal="up">{bartenders.title}</h3>
          <p className="lede" data-reveal="up" data-delay="0.08">{bartenders.copy}</p>
          <div data-reveal="up" data-delay="0.16"><Link to={bartenders.cta.to} className="btn btn--ghost">{bartenders.cta.label} <Arrow /></Link></div>
        </div>
      </article>

      {/* C: full-bleed wide frame with text on the image */}
      <article className="aud__c">
        <div className="aud__imgC" data-reveal="img">
          <img data-parallax="0.14" src={media.bars.src} width={media.bars.w} height={media.bars.h} alt={media.bars.alt} loading="lazy" decoding="async" />
        </div>
        <div className="wrap aud__copyC">
          <span className="aud__no" data-reveal="fade">03</span>
          <h3 className="display" data-reveal="up">{bars.title}</h3>
          <p className="lede" data-reveal="up" data-delay="0.08">{bars.copy}</p>
          <div className="aud__ctaRow" data-reveal="up" data-delay="0.16">
            <Link to={bars.cta.to} className="btn">{bars.cta.label} <Arrow /></Link>
          </div>
        </div>
      </article>

      <div className="wrap aud__wholesale" data-reveal="up">
        <div>
          <p className="eyebrow">{wholesaleTeaser.title}</p>
          <p className="h3">{wholesaleTeaser.copy}</p>
        </div>
        <Link to={wholesaleTeaser.cta.to} className="link-u">{wholesaleTeaser.cta.label} <Arrow /></Link>
      </div>
    </section>
  );
}
