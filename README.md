# Speed Tin: cinematic redesign (React + GSAP + Three.js)

A custom storefront front end for https://speedtin.com. Content, products, prices, variants, photos and
video all come from the live site; nothing is invented.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run sync:shopify   # refresh prices / variants / availability from speedtin.com
```

## The signature effect: the connected pour
`src/components/PourStage.jsx` + `src/gl/*`

The hero and the glass section are **one scene**. A real photographed hand and Speed Tin (cut out from the
site's own studio shot) sits in the hero; its spout is pinned to the page's vertical centre line. A canvas
stream is drawn every frame from the live spout position down through the section boundary to the live
liquid surface in the 3D glass, so it stays connected while you scroll, tilt (scroll-linked) and parallax.
The glass fills with scroll; when it is full the stream's tail drains into it. Reduced-motion users get a
static, filled glass and a still stream.

## What is real vs. generated
| Real, from speedtin.com | Generated for this redesign |
|---|---|
| Logo, copy, nav, testimonials, story | 3D coupe glass, liquid, ripples, lime wheel (Three.js, `src/gl`) |
| Product + lifestyle photography | Ice, zest, droplet sprites (`scripts/render-fx.mjs`) |
| Hand + shaker (ML cutout of the site's pouring photo) | The liquid stream (procedural, `src/gl/stream.js`) |
| Demo montage and 3 social clips (re-encoded smaller) | Background-removed product cutouts (`out_*.png` mattes) |
| YouTube tutorials (click-to-load), Kickstarter film (streamed from your CDN) | |

**Known limitation:** there is no photograph of a hand holding a cocktail glass on the site, and none was
fabricated. The glass is a 3D render. If you shoot one, drop a transparent PNG into `public/media` and swap it
in `PourStage.jsx` (the stream already targets the surface point, so it only needs that anchor).

## Shopify integration
Connected (no token needed): variant ids, prices, compare-at, availability (`src/data/catalog.json`);
**checkout** via cart permalink `https://speedtin.com/cart/<variantId>:<qty>,...` (real Shopify checkout);
account / policies / GoAffPro affiliate sign-up links; contact and newsletter forms POST to the store's own
`/contact` endpoint with the same field names as the live theme.
Not included: server-side cart, live inventory polling, discount codes. For those, add a Storefront API
token and replace `src/lib/shopify.js`.
Routes mirror live URLs (`/products/:handle`, `/collections/shop`, `/pages/...`), so it can replace the theme.
Notes: the live footer links Bars & Restaurants to `/pages/bars-and-restaurants-2` (a 404); this build routes it
to the working page. The `Speed Tin 2.0 (50 Units)` product has no images and is not in the shop collection, so
it is not shown.

## Asset pipeline
`scripts/build-assets.mjs` (photos, cutouts, video) and `scripts/render-fx.mjs` (sprites; needs `npm run dev`).
Originals are expected in `../_research` (`raw/img`, `raw/vid`, `matte/out_*.png`).

## Structure
`src/components` sections and chrome, `src/pages` routes, `src/gl` glass/stream, `src/data` content + catalog,
`src/styles` tokens/base/layout/sections/pages/pour. `tools/` holds the screenshot helpers used for QA.
