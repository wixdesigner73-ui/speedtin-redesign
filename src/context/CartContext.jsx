import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { checkoutUrl } from "../lib/shopify";

const KEY = "speedtin.cart.v1";
const CartCtx = createContext(null);

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function reducer(lines, a) {
  switch (a.type) {
    case "add": {
      const i = lines.findIndex((l) => l.variantId === a.line.variantId);
      if (i > -1) return lines.map((l, k) => (k === i ? { ...l, qty: Math.min(99, l.qty + a.line.qty) } : l));
      return [...lines, a.line];
    }
    case "qty":
      return lines.map((l) => (l.variantId === a.variantId ? { ...l, qty: Math.max(1, Math.min(99, a.qty)) } : l));
    case "remove":
      return lines.filter((l) => l.variantId !== a.variantId);
    case "clear":
      return [];
    default:
      return lines;
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ }
  }, [lines]);

  const add = useCallback((product, variant, qty = 1) => {
    dispatch({
      type: "add",
      line: {
        variantId: variant.id,
        handle: product.handle,
        title: product.short,
        variantTitle: variant.title === "Default Title" ? null : variant.title,
        price: variant.price,
        image: product.cutout || product.photo || product.gallery?.[0] || null,
        qty,
      },
    });
    setBump((b) => b + 1);
    setOpen(true);
  }, []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return {
      lines, count, subtotal, open, setOpen, bump, add,
      setQty: (variantId, qty) => dispatch({ type: "qty", variantId, qty }),
      remove: (variantId) => dispatch({ type: "remove", variantId }),
      clear: () => dispatch({ type: "clear" }),
      checkoutUrl: checkoutUrl(lines),
    };
  }, [lines, open, bump, add]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);
