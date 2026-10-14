// Pulls live product data (titles, prices, compare-at prices, variants, availability) from the
// public Shopify storefront feed and writes src/data/catalog.json.
//
//   npm run sync:shopify              (defaults to https://speedtin.com)
//   npm run sync:shopify -- https://your-store.myshopify.com
//
// Variant ids in this file are what the cart sends to Shopify's cart permalink
// (https://<store>/cart/<variantId>:<qty>,...), so checkout always uses the real store.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const store = (process.argv[2] || "https://speedtin.com").replace(/\/$/, "");
const out = path.resolve(here, "../src/data/catalog.json");

const strip = (html = "") =>
  html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const res = await fetch(`${store}/products.json?limit=250`);
if (!res.ok) throw new Error(`products.json -> ${res.status}`);
const { products } = await res.json();

// Which products each live collection contains (the shop page and the bars page)
async function collection(handle) {
  const r = await fetch(`${store}/collections/${handle}/products.json?limit=250`);
  if (!r.ok) return [];
  return (await r.json()).products.map((p) => p.handle);
}

const catalog = {
  store,
  syncedAt: new Date().toISOString(),
  collections: { shop: await collection("shop"), "bars-and-restaurants": await collection("bars-and-restaurants") },
  products: products.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: strip(p.body_html),
    options: p.options.map((o) => ({ name: o.name, values: o.values })),
    variants: p.variants.map((v) => ({
      id: v.id,
      title: v.title,
      option1: v.option1,
      price: Number(v.price),
      compareAt: v.compare_at_price ? Number(v.compare_at_price) : null,
      available: v.available,
    })),
    images: p.images.map((i) => i.src.split("?")[0]),
  })),
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(catalog, null, 2));
console.log(`wrote ${catalog.products.length} products -> ${path.relative(process.cwd(), out)}`);
console.log("collections:", JSON.stringify(catalog.collections));
