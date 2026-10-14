// Shopify bridge.
//
// CONNECTED to the real store (no token required):
//   • Variant ids / prices / availability  -> src/data/catalog.json (npm run sync:shopify)
//   • Checkout -> Shopify cart permalink:  https://<store>/cart/<variantId>:<qty>,<variantId>:<qty>
//     Opening it adds the lines to the store's own cart and continues to the real Shopify checkout.
//   • Account, policies, GoAffPro affiliate sign-up, contact + newsletter forms post to the live store.
//
// NOT included (needs a Storefront API token, see README "Going fully headless"):
//   • live inventory polling, server-side cart, discount-code validation.
import { STORE_URL } from "../data/site";

export function checkoutUrl(lines) {
  if (!lines.length) return `${STORE_URL}/cart`;
  return `${STORE_URL}/cart/${lines.map((l) => `${l.variantId}:${l.qty}`).join(",")}`;
}

export const shopifyPaths = {
  contactForm: `${STORE_URL}/contact#contact_form`,
  account: `${STORE_URL}/account/login`,
};
