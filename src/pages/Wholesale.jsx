import { Link } from "react-router-dom";
import { wholesale } from "../data/site";
import PageHero from "../components/PageHero";
import { Arrow } from "../components/Icons";
import { useMeta } from "../hooks/useMeta";

export default function Wholesale() {
  useMeta(wholesale.title, wholesale.lead);
  return (
    <>
      <PageHero eyebrow="Wholesale" title={wholesale.title} lede={wholesale.lead} image="/media/wholesale-mood.webp">
        <Link to="/pages/contact-us" className="btn">Contact Us <Arrow /></Link>
      </PageHero>

      <section className="ws on-light">
        <div className="wrap ws__grid">
          <div className="ws__lead">
            <p className="eyebrow" data-reveal="up">{wholesale.subtitle}</p>
            <h2 className="h2" data-reveal="up" data-delay="0.06">{wholesale.subtitle}</h2>
            <p className="lede" data-reveal="up" data-delay="0.12">{wholesale.copy}</p>
            <div data-reveal="up" data-delay="0.18"><Link to="/pages/contact-us" className="btn btn--dark">Contact Us <Arrow /></Link></div>
          </div>
          <ul className="ws__perks">
            {wholesale.perks.map((p, i) => (
              <li key={p} data-reveal="up" data-delay={i * 0.08}><span>0{i + 1}</span><p>{p}</p></li>
            ))}
          </ul>
        </div>
        <div className="wrap ws__img" data-reveal="img"><img src="/media/products-six.webp" alt="Speed Tin Standard and 2.0 shakers with their boxes" loading="lazy" /></div>
      </section>
    </>
  );
}
