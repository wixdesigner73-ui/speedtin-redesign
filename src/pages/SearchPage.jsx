import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../data/products";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";
import { useMeta } from "../hooks/useMeta";

export default function SearchPage() {
  const [sp] = useSearchParams();
  const q = sp.get("q") || "";
  const results = searchProducts(q);
  useMeta(q ? `Search: ${q}` : "Search");
  return (
    <>
      <PageHero eyebrow="Search" title={q ? <>“{q}”</> : "Search"} lede={q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Use the search icon to find a product."} />
      <section className="coll on-light" style={{ paddingTop: 40 }}>
        <div className="wrap srch__grid">
          {results.map((p) => (<ProductCard key={p.handle} product={p} />))}
          {q && results.length === 0 && <p className="lede">Nothing found. Try “shaker”, “grips” or “bundle”.</p>}
        </div>
      </section>
    </>
  );
}
