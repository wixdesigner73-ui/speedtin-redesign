// Product content layer. Live commerce data (ids, prices, compare-at, availability) comes from
// catalog.json (npm run sync:shopify). Copy below is as published on speedtin.com product pages.
import catalog from "./catalog.json";

const media = (n, ext = "webp") => `/media/${n}.${ext}`;

const content = {
  "standard-stainless-steel": {
    short: "Speed Tin Standard",
    size: "28oz Stainless Steel",
    tagline: "Shake. Strain. Pour. One hand.",
    lead: "The full-size Speed Tin, supplied complete with its 28oz stainless steel base tin. Its quick-pour mechanism and built-in strainer let you pour after shaking without separating the tins.",
    purchaseNote: "Complete shaker with 28oz stainless steel base tin and three interchangeable finger grips.",
    useNote: "For shaking with ice. Not designed for dry shaking.",
    card: { cut: "cut-standard", tone: "dark", blurb: "Pairs with most 28oz cocktail shaker tins. Perfect for multiple shots or cocktails." },
    gallery: ["std-studio", "anatomy", "box-and-tins", "pour-martini", "sled-detail"],
    inBox: [
      "Speed Tin shaker top with quick-pour mechanism and built-in strainer",
      "28oz stainless steel base tin",
      "3 interchangeable finger grips: Short, Standard and Long",
    ],
    inBoxNote: "No separate base tin purchase needed. Choose the grip that feels most comfortable for your hand.",
    tutorial: "ELNXHUlMtZE",
    compare: "2-0-stainless-steel",
    faq: [
      ["Can I use it for a dry shake?", "Speed Tin is not designed for dry shaking (shaking without ice) and may leak when used this way. Use a traditional shaker for recipes that require a dry shake."],
      ["Do I need to choose a grip size?", "No. Short, Standard and Long finger grips are included, so you can choose your preferred fit after it arrives."],
    ],
    sizeNote: "Choose the Standard for a larger tin pairing. Prefer a smaller setup? Compare the compact 16oz model.",
  },
  "2-0-stainless-steel": {
    short: "Speed Tin 2.0",
    size: "16oz Stainless Steel",
    tagline: "Shake. Strain. Pour. One hand.",
    lead: "A compact cocktail shaker with a quick-pour mechanism and built-in strainer. Pour after shaking without separating the tins or reaching for a separate strainer.",
    purchaseNote: "Complete shaker with 16oz stainless steel base tin and three interchangeable finger grips.",
    useNote: "For shaking with ice. Not designed for dry shaking.",
    card: { cut: "cut-2-0", tone: "warm", blurb: "Designed to pair with most 16oz cocktail shaker tins. Perfect for shots or a single cocktail." },
    gallery: ["two-studio", "anatomy", "pour-martini", "tins-and-box-2", "shots-2-0", "sled-detail"],
    inBox: [
      "Speed Tin shaker top with quick-pour mechanism and built-in strainer",
      "16oz stainless steel base tin",
      "3 interchangeable finger grips: Short, Standard and Long",
    ],
    inBoxNote: "No separate base tin purchase needed. Choose the grip that feels most comfortable for your hand.",
    tutorial: "ELNXHUlMtZE",
    compare: "standard-stainless-steel",
    faq: [
      ["Can I use it for a dry shake?", "Speed Tin is not designed for dry shaking (shaking without ice) and may leak when used this way. Use a traditional shaker for recipes that require a dry shake."],
      ["Do I need to choose a grip size?", "No. Short, Standard and Long finger grips are included, so you can choose your preferred fit after it arrives."],
    ],
    sizeNote: "The 16oz model is ideal for 1 to 2 cocktails or up to 6 shots, and is more ergonomic for those with smaller hands.",
  },
  "the-set-1-standard-speed-tin-1-2-0-speed-tin": {
    short: "The Set",
    size: "1 Standard · 1 Speed Tin 2.0",
    tagline: "Both sizes. One smoother workflow.",
    lead: "Get two complete Speed Tin shakers: the Standard with its 28oz base tin and the compact 2.0 with its 16oz base tin. Each has a quick-pour mechanism and built-in strainer, so you can pour after shaking without separating the tins.",
    purchaseNote: "Two complete Speed Tin shakers: Standard with its 28oz base tin and 2.0 with its 16oz base tin.",
    useNote: "For shaking with ice. Not designed for dry shaking.",
    saving: "Save $14.98 vs. buying the two models individually. Current individual product total: $54.98. Before any checkout discounts.",
    card: { cut: "cut-set", tone: "champagne", blurb: "One Standard and one 2.0, with their corresponding shaker tins." },
    gallery: ["set-square", "anatomy", "sled-detail", "box-pair", "accessories-mat", "pour-cosmo"],
    inBox: [
      "1 Speed Tin Standard, including its 28oz stainless steel base tin",
      "1 Speed Tin 2.0, including its 16oz stainless steel base tin",
    ],
    inBoxNote: "Both matching base tins are included. Keep both sizes available and choose the pairing that suits the drink you are making.",
    tutorial: "ELNXHUlMtZE",
    faq: [
      ["Can I use it for a dry shake?", "Speed Tin is not designed for dry shaking (shaking without ice) and may leak when used this way. Use a traditional shaker for recipes that require a dry shake."],
      ["Does the Set include both base tins?", "Yes. You receive two complete shakers: the Standard with its 28oz stainless steel base tin and the 2.0 with its 16oz stainless steel base tin. Neither base tin needs to be purchased separately."],
    ],
    sizeNote: "The Set gives you both current models, so you do not have to choose just one size. Each Speed Tin pairs with its own corresponding base tin.",
  },
  "replacement-sled": {
    short: "Replacement Sled",
    size: "For Standard and 2.0",
    tagline: null,
    lead: "(1) Replacement Sled for Speed Tin Standard and Speed Tin 2.0",
    card: { cut: "cut-sled", tone: "warm", blurb: "(1) Replacement Sled for Speed Tin Standard and Speed Tin 2.0" },
    gallery: ["sled-photo"],
  },
  "replacement-spring-gaskets": {
    short: "Replacement Spring & Gaskets",
    size: "For Standard and 2.0",
    tagline: null,
    lead: "Replacement Spring & Gaskets for Sled of Speed Tin Standard and Speed Tin 2.0",
    card: { cut: "cut-spring", tone: "dark", blurb: "Replacement Spring & Gaskets for the sled of Speed Tin Standard and Speed Tin 2.0" },
    gallery: ["spring-photo"],
  },
  "grip-fire": {
    short: "Colored Grips",
    size: "Red · Fire · Green · Ice · Pink",
    tagline: "Set your Speed Tin apart with this colored grip!",
    lead: "Easily change out your grip with a flat screw driver! Just insert the screwdriver into the slot on the back of the sled and twist!",
    purchaseNote: "Note: Only the neutral finger placement is available for colors at this time!",
    card: { photo: "grips-bar", tone: "photo", blurb: "Set your Speed Tin apart with a colored grip." },
    gallery: ["grips-bar"],
    tutorial: "5FaaCei3YAI",
    tutorialTitle: "How to Change Your Grips!",
    swatches: { Red: "#d0202c", Fire: "#f08a1c", Green: "#1fa35b", Ice: "#4db8ea", Pink: "#ee6aa8" },
  },
  "speed-tin-bar-bundle-4": {
    short: "Speed Tin Bar Bundle #1",
    size: "3 Standard · 3 Speed Tin 2.0",
    lead: "Includes (3) Speed Tin Standards and (3) Speed Tin 2.0. Note: Does not include product packaging. Affiliate Discounts Do Not Apply",
    card: { cut: "cut-bundle-1", tone: "dark", blurb: "Includes (3) Speed Tin Standards and (3) Speed Tin 2.0." },
    gallery: ["bundle-1-graphic"],
  },
  "speed-tin-bar-bundle-3": {
    short: "Speed Tin Bar Bundle #2",
    size: "5 Standard · 5 Speed Tin 2.0",
    lead: "Includes (5) Speed Tin Standards and (5) Speed Tin 2.0. Note: Does not include product packaging. Discounts Affiliate Do Not Apply",
    card: { cut: "cut-bundle-2", tone: "warm", blurb: "Includes (5) Speed Tin Standards and (5) Speed Tin 2.0." },
    gallery: ["bundle-2-graphic"],
  },
};

const byHandle = Object.fromEntries(catalog.products.map((p) => [p.handle, p]));

function build(handle) {
  const live = byHandle[handle];
  const c = content[handle];
  if (!live || !c) return null;
  const variants = live.variants;
  const priced = variants.map((v) => v.price);
  const first = variants[0];
  return {
    handle,
    id: live.id,
    title: live.title,
    ...c,
    options: live.options,
    variants,
    price: Math.min(...priced),
    compareAt: first.compareAt && first.compareAt > first.price ? first.compareAt : null,
    discount: first.compareAt && first.compareAt > first.price ? Math.floor((1 - first.price / first.compareAt) * 100 + 1e-6) : 0,
    gallery: (c.gallery || []).map((g) => media(g)),
    cutout: c.card?.cut ? media(c.card.cut) : null,
    photo: c.card?.photo ? media(c.card.photo) : null,
    anyAvailable: variants.some((v) => v.available),
    hasVariants: variants.length > 1,
  };
}

export const shopHandles = catalog.collections.shop;
export const barsHandles = catalog.collections["bars-and-restaurants"];
export const getProduct = (handle) => build(handle);
export const shopProducts = shopHandles.map(build).filter(Boolean);
export const barsProducts = barsHandles.map(build).filter(Boolean);
export const allProducts = [...shopProducts, ...barsProducts];
export const catalogMeta = { store: catalog.store, syncedAt: catalog.syncedAt };

// Client-side search over the real catalogue (11 products, so no network round-trip is needed)
export function searchProducts(q) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return allProducts.filter((p) => `${p.title} ${p.short} ${p.size} ${p.lead}`.toLowerCase().includes(s));
}
