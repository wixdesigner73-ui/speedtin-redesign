import { Link } from "react-router-dom";
import { difference } from "../data/site";
import { getProduct } from "../data/products";
import ProductCard from "./ProductCard";
import { Arrow } from "./Icons";

const slot = {
  "standard-stainless-steel": "c-std",
  "2-0-stainless-steel": "c-two",
  "the-set-1-standard-speed-tin-1-2-0-speed-tin": "c-set",
  "replacement-sled": "c-sled",
  "replacement-spring-gaskets": "c-spring",
  "grip-fire": "c-grip",
};

export default function Collection({ handles = Object.keys(slot), heading = true }) {
  return (
    <section className="coll on-light" aria-labelledby="coll-h">
      {heading && (
        <div className="wrap coll__head">
          <div>
            <p className="eyebrow" data-reveal="up">Shop · Ships within 24 hours</p>
            <h2 id="coll-h" className="h2" data-reveal="up" data-delay="0.08">{difference.banner}</h2>
          </div>
          <Link to="/collections/shop" className="btn btn--dark" data-reveal="up" data-delay="0.16">Shop All <Arrow /></Link>
        </div>
      )}
      <div className="wrap coll__grid">
        {handles.map((h, i) => {
          const p = getProduct(h);
          if (!p) return null;
          return (
            <div key={h} className={`coll__cell ${slot[h]}`} data-reveal="up" data-delay={(i % 3) * 0.08}>
              <ProductCard product={p} className="is-fill" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
