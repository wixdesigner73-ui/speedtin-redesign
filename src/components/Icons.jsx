const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const Arrow = ({ className = "arr" }) => (
  <svg className={className} viewBox="0 0 24 24" {...base}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
);
export const Search = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
);
export const User = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base}><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c.9-3.6 3.8-5.4 7.5-5.4s6.6 1.8 7.5 5.4" /></svg>
);
export const Bag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base}><path d="M5.5 8h13l-1 12h-11l-1-12Z" /><path d="M9 8V6.6A3 3 0 0 1 12 3.6a3 3 0 0 1 3 3V8" /></svg>
);
export const Close = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base}><path d="M5 5l14 14M19 5 5 19" /></svg>
);
export const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><path d="M5 12h14" /></svg>
);
export const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
);
export const Play = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2Z" /></svg>
);
export const Chevron = ({ dir = "down" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} style={{ transform: dir === "up" ? "rotate(180deg)" : dir === "left" ? "rotate(90deg)" : dir === "right" ? "rotate(-90deg)" : "none" }}><path d="m6 9 6 6 6-6" /></svg>
);
export const Bolt = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 2 5 13.4h5.6L9.5 22 19 9.8h-5.8L13.5 2Z" /></svg>
);
