import { useEffect } from "react";

const BASE = "Speed Tin";

// Per-route <title>, meta description and optional JSON-LD (kept out of the DOM on unmount).
export function useMeta(title, description, jsonLd) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — The World’s First One-Handed Cocktail Shaker`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    if (description) meta.content = description;
    let tag = null;
    if (jsonLd) {
      tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(tag);
    }
    return () => { if (tag) tag.remove(); };
  }, [title, description, jsonLd]);
}
